import * as Rx from 'rxjs';
import * as RxOp from 'rxjs/operators';
import { Interfaces, Enums } from './shared';

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
  private sjStoreCommands: Rx.Subject<Interfaces.StoreCommand>;

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
    this.sjStoreCommands = new Rx.Subject();
    this.stateChangesSubjectMap = new Map();
    this.store = {} as StoreType;
  }

  /**
   * Adds a sub-store to the general store.
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

    this.sjStoreCommands.next({
      type: Enums.StoreCommandType.AddSubStore,
      data: clonedState,
    });
  }

  /**
   * Creates hot observable from `Store Changes` data flow and return it.
   *
   * @return {Rx.Observable<Interfaces.SetStateCommand>}
   */
  getStoreCommandObserver (
  ): Rx.Observable<Interfaces.StoreCommand> {
    return this.sjStoreCommands.asObservable();
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

    // Create a `State Change` subject if it isn't exists
    if (this.stateChangesSubjectMap.has(statePath) === false) {
      const sjStateChangesNew = new Rx.Subject<Interfaces.StateChange>();
      this.stateChangesSubjectMap.set(statePath, sjStateChangesNew);
    }
    // Create the `State Change` subject
    const sjStateChanges = this.stateChangesSubjectMap.get(statePath);

    // Create observable which extracts data from `State Change` flow
    const obsStateChanges = sjStateChanges
      .pipe(
        RxOp.map((stateChange: Interfaces.StateChange<StateType>) => {
          return stateChange.newValue;
        }),
      );

    // Return observer which doesn't emit current value of state if `Only Changes` flag is enabled
    if (onlyChanges === true) {
      return obsStateChanges;
    }

    // Get current value of state and create sync observer from it
    const value = this.getStateByPath<StateType>(statePath);
    const obsCurrentState = Rx.of(value);

    // Return observer which emits current value of state
    return Rx.merge(
      obsCurrentState,
      obsStateChanges,
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
    // Get old value of state (for command)
    const oldValue = KrixHelper.get(this.store, statePath);

    // Set the new state to the state if the new state isn't a signal
    const stateActionIsSignal = KrixHelper.get(stateAction, 'options.signal', false);
    if (stateActionIsSignal !== true) {
      KrixHelper.set(this.store, statePath, stateAction.value);
    }

    // Emit a `Update State` signal to the `State Changes` subject if it exists
    if (this.stateChangesSubjectMap.has(statePath) === true) {
      const sjStateChanges = this.stateChangesSubjectMap.get(statePath);
      sjStateChanges.next({
        oldValue: oldValue,
        newValue: stateAction.value,
      });
    }

    // Prepare and emit `Set State` command
    const commandData: Interfaces.SetStateCommand = {
      statePath: statePath,
      state: stateAction.state,
      oldValue: oldValue,
      newValue: stateAction.value,
      options: stateAction.options,
    };

    this.sjStoreCommands.next({
      type: Enums.StoreCommandType.SetState,
      data: commandData,
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
