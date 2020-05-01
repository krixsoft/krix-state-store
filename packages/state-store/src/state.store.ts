import * as Rx from 'rxjs';
import * as RxOp from 'rxjs/operators';
import { Interfaces } from './shared';

import { KrixHelper } from './krix.helper';

export class StateStore<StoreType = any> {
  /**
   * Krix store
   */
  private store: any;

  /**
   * Map which stores subjects for states
   */
  private stateChangesSubjectMap: Map<string, Rx.Subject<Interfaces.StateChange>>;

  /**
   * Subject for handling state changes
   */
  private sjStoreChanges: Rx.Subject<Interfaces.StoreChange>;

  /**
   * Subject for stopping state watchers
   */
  private sjStopSignal: Rx.Subject<any>;

  /**
   * Creates instance of Krix.
   *
   * @static
   * @param  {Interfaces.KrixOptions<StoreType>} [options] - Krix options
   * @return {Krix<StoreType>}
   */
  static create <StoreType> (
  ): StateStore<StoreType> {
    const inst = new StateStore<StoreType>();
    return inst;
  }

  constructor () {
    this.sjStoreChanges = new Rx.Subject();
    this.sjStopSignal = new Rx.Subject();
    this.stateChangesSubjectMap = new Map();
    this.store = {} as StoreType;
  }

  /**
   * Adds store partition to general store
   *
   * @param  {string} subStoreName
   * @param  {SubStoreType} subStore
   * @return {void}
   */
  addSubStore <SubStoreType = any> (
    subStoreName: string,
    subStore: SubStoreType,
  ): void {
    const isPathAlreadyExists = KrixHelper.get(this.store, subStoreName);

    if(KrixHelper.isUndefined(isPathAlreadyExists) === false) {
      throw new Error(`StateStore - addStore: This store already exists`);
    }

    const clonedState = KrixHelper.cloneDeep(subStore);
    KrixHelper.set(this.store, subStoreName, clonedState);
  }

  /**
   * Creates hot observable from `Store Changes` data flow and return it.
   *
   * @return {Rx.Observable<Interfaces.StoreChange>}
   */
  getStoreChangesObserver (
  ): Rx.Observable<Interfaces.StoreChange> {
    return this.sjStoreChanges.asObservable();
  }

  /**
   * Returns state watcher - Observable which emits all changes of selected state.
   *
   * @param  {string[]} state - parts of state path
   * @param  {boolean} [onlyChanges=false] - emits only changes (without current state)
   * @return {Rx.Observable<StateType>}
   */
  select <StateType = any> (
    state: string[],
    onlyChanges: boolean = false,
  ): Rx.Observable<StateType> {
    const statePath = this.getStatePath(state);

    if (this.stateChangesSubjectMap.has(statePath) === false) {
      const sjStateChangesNew = new Rx.Subject<Interfaces.StateChange>();
      this.stateChangesSubjectMap.set(statePath, sjStateChangesNew);
    }
    const sjStateChanges = this.stateChangesSubjectMap.get(statePath);

    const obsStateChanges = sjStateChanges
      .pipe(
        RxOp.map((stateChange: Interfaces.StateChange<StateType>) => {
          return stateChange.newValue;
        }),
        RxOp.takeUntil(this.sjStopSignal),
      );

    if (onlyChanges) {
      return obsStateChanges;
    }

    const value = this.getStateByPath<StateType>(statePath);
    const obsCurrentState = Rx.of(value);

    return Rx.merge(
      obsCurrentState,
      obsStateChanges,
    )
      .pipe(
        RxOp.takeUntil(this.sjStopSignal),
      );
  }

  /**
   * Returns state by parts of state path.
   *
   * @param  {string[]} [state] - parts of state path
   * @return {StateType}
   */
  getState <StateType = any> (
    state?: string[],
  ): StateType {
    const statePath = this.getStatePath(state);
    const stateValue = this.getStateByPath(statePath);
    return stateValue;
  }

  /**
   * Returns state by state path.
   *
   * @param  {string} [statePath] - state path
   * @return {StateType}
   */
  getStateByPath <StateType = any> (
    statePath?: string,
  ): StateType {
    if (KrixHelper.isString(statePath) === false || statePath === ``) {
      return this.store;
    }

    const stateValue = KrixHelper.get(this.store, statePath);
    return stateValue;
  }

  /**
   * Sets new state using the state action.
   *
   * @param  {Interfaces.StateAction} stateAction - action to change state
   * @return {void}
   */
  setState (
    stateAction: Interfaces.StateAction,
  ): void {
    if (KrixHelper.isObject(stateAction) === false) {
      throw new Error(`StateStore - setState: State action isn't exist`);
    }

    if (Array.isArray(stateAction.state) === false) {
      throw new Error(`StateStore - setState: State doesn't have an 'array' type`);
    }

    const statePath = this.getStatePath(stateAction.state);
    const oldValue = KrixHelper.get(this.store, statePath);

    const stateActionIsSignal = KrixHelper.get(stateAction, 'options.signal', false);
    if (stateActionIsSignal !== true) {
      KrixHelper.set(this.store, statePath, stateAction.value);
    }

    if (this.stateChangesSubjectMap.has(statePath) === true) {
      const sjStateChanges = this.stateChangesSubjectMap.get(statePath);
      sjStateChanges.next({
        oldValue: oldValue,
        newValue: stateAction.value,
      });
    }

    this.sjStoreChanges.next({
      statePath: statePath,
      state: stateAction.state,
      oldValue: oldValue,
      newValue: stateAction.value,
      options: stateAction.options,
    });
  }

  /**
   * Sets new states using state actions.
   *
   * @param  {Interfaces.StateAction[]} stateActions - actions to change states
   * @return {void}
   */
  setStates (
    stateActions: Interfaces.StateAction[],
  ): void {
    if (Array.isArray(stateActions) === false) {
      throw new Error(`StateStore - setStates: The input argument must be an array`);
    }

    stateActions.forEach((stateAction) => {
      this.setState(stateAction);
    });
  }

  /**
   * HELPERs
   */

  /**
   * Creates state path from parts of state path.
   *
   * @param  {string[]} state - parts of state path
   * @return {string} - State path
   */
  private getStatePath (
    state: string[],
  ): string {
    if (Array.isArray(state) === false) {
      return ``;
    }

    const statePath = state.join('.');
    return statePath;
  }
}
