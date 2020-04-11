import * as Rx from 'rxjs';
import * as RxOp from 'rxjs/operators';
import { Interfaces } from './shared';

import { KrixHelper } from './krix.helper';

export class Krix<T> {
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
   * Initial options
   */
  private options: Interfaces.KrixOptions<any>;

  /**
   * Creates instance of Krix.
   *
   * @static
   * @param  {Interfaces.KrixOptions<StoreType>} [options] - Krix options
   * @return {Krix<StoreType>}
   */
  static create <StoreType> (
    options?: Interfaces.KrixOptions<StoreType>,
  ): Krix<StoreType> {
    const inst = new Krix<StoreType>();
    inst.init(options);
    return inst;
  }

  constructor () {
    this.sjStoreChanges = new Rx.Subject();
    this.sjStopSignal = new Rx.Subject();
    this.stateChangesSubjectMap = new Map();
  }

  /**
   * Inits Krix.
   * - sets initial value of store;
   *
   * @param  {Interfaces.KrixOptions<StoreType>} [options] - Krix options
   * @return {void}
   */
  init <StoreType> (
    options?: Interfaces.KrixOptions<StoreType>,
  ): void {
    if (!KrixHelper.isObject(options)
        || KrixHelper.isNull(options)
        || Array.isArray(options)) {
      this.store = {};
      this.options = {} as Interfaces.KrixOptions<StoreType>;
      return;
    }
    this.options = { ...options };

    this.store = KrixHelper.isObject(this.options.initStore)
      ? KrixHelper.cloneDeep(this.options.initStore) : {};

    this.stateChangesSubjectMap.clear();
  }

  /**
   * Destroys Krix.
   * - stops all state watchers;
   * - clears a state changes subject map;
   * - sets a store to empty object;
   *
   * @return {void}
   */
  destroy (): void {
    this.sjStopSignal.next(null);
    this.stateChangesSubjectMap.clear();
    this.store = {};
  }

  /**
   * Resets Krix to initial state.
   *
   * @return {void}
   */
  reset (): void {
    this.destroy();
    this.init(this.options);
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
    if (!KrixHelper.isString(statePath) || statePath === ``) {
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
    if (!KrixHelper.isObject(stateAction)) {
      throw new Error(`Krix - setState: State action isn't exist`);
    }

    if (!Array.isArray(stateAction.state)) {
      throw new Error(`Krix - setState: State doesn't have an 'array' type`);
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
    if (!Array.isArray(stateActions)) {
      return;
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
    if (!Array.isArray(state)) {
      return ``;
    }

    const statePath = state.join('.');
    return statePath;
  }
}