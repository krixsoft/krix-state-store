import * as Rx from 'rxjs';
import * as RxOp from 'rxjs/operators';
import { Interfaces, Enums } from './shared';

import { KrixHelper } from './krix.helper';

export class StateStore<StoreType = any> {
  /**
   * Krix state store
   */
  private store: any;

  /**
   * Map which stores subjects for states
   */
  private stateChangesSubjectMap: Map<string, Rx.Subject<Interfaces.StateChange>>;

  /**
   * Subject which handles store commands
   */
  private sjStoreCommands: Rx.Subject<Interfaces.StoreCommand>;

  /**
   * Creates an instance of the Krix state store.
   *
   * @static
   * @return {StateStore<CreateStoreType>}
   */
  static create <CreateStoreType = any> (
  ): StateStore<CreateStoreType> {
    const inst = new StateStore<CreateStoreType>();
    return inst;
  }

  constructor () {
    this.sjStoreCommands = new Rx.Subject();
    this.stateChangesSubjectMap = new Map();
    this.store = {} as StoreType;
  }

  /**
   * Creates a `lite` RxJS observable from the `Store Commands` RxJS subject and returns it.
   *
   * @return {Rx.Observable<Interfaces.StoreCommand>}
   */
  getStoreCommandObserver (
  ): Rx.Observable<Interfaces.StoreCommand> {
    return this.sjStoreCommands.asObservable();
  }

  /**
   * Returns a state watcher - a 'lite' RxJS observable which emits all changes of the selected state.
   * If the `onlyChanges` flag is enabled the observable will receive a value after subscription.
   *
   * @param  {string[]} stateSelector - list of parts of state path
   * @param  {boolean} [onlyChanges=false] - emits only changes (without current state)
   * @return {Rx.Observable<StateValueType>}
   */
  select <StateValueType = any> (
    stateSelector: string[],
    onlyChanges: boolean = false,
  ): Rx.Observable<StateValueType> {
    const statePath = this.getStatePath(stateSelector);

    // Create a `State Change` subject if it doesn't exist and save it to the `State Changes Subject` map
    if (this.stateChangesSubjectMap.has(statePath) === false) {
      const sjStateChangesNew = new Rx.Subject<Interfaces.StateChange>();
      this.stateChangesSubjectMap.set(statePath, sjStateChangesNew);
    }
    // Get the `State Change` subject from the `State Changes Subject` map
    const sjStateChanges = this.stateChangesSubjectMap.get(statePath);

    // Create an observable which extracts a state value from the `State Change` flow
    const obsStateChanges = sjStateChanges
      .pipe(
        RxOp.map((stateChange: Interfaces.StateChange<StateValueType>) => {
          return stateChange.newValue;
        }),
      );

    // Return an observer which doesn't emit a current value of the state if the `Only Changes` flag is enabled
    if (onlyChanges === true) {
      return obsStateChanges;
    }

    // Get a current value of the state and create a sync observer from it
    const stateValue = this.getStateValueByStatePath<StateValueType>(statePath);
    const obsCurrentStateValue = Rx.of(stateValue);

    // Return an observer which emits a current value of the state
    return Rx.merge(
      obsCurrentStateValue,
      obsStateChanges,
    );
  }

  /**
   * Returns a state value by the state selector.
   * If the state selector isn't set this method will return a store (a root state value).
   *
   * @param  {string[]} [stateSelector] - state selector
   * @return {StateValueType}
   */
  getState <StateValueType = any> (
    stateSelector?: string[],
  ): StateValueType {
    const statePath = this.getStatePath(stateSelector);
    const stateValue = this.getStateValueByStatePath(statePath);
    return stateValue;
  }

  /**
   * Returns state by state path.
   *
   * @param  {string} [statePath] - state path
   * @return {StateValueType}
   */
  getStateValueByStatePath <StateValueType = any> (
    statePath?: string,
  ): StateValueType {
    if (KrixHelper.isString(statePath) === false || statePath === ``) {
      return this.store;
    }

    const stateValue = KrixHelper.get(this.store, statePath);
    return stateValue;
  }

  /**
   * Sets a new state value to the store and emits `State Change` and `Store Command` signals for the new state.
   * If the `signal` flag is enabled this method wosn't set the new value to the store.
   * If the `compare` flag is enabled and an old value equals the new value this method wosn't save the new state
   * to the store and wosn't emit the `State Change` signal.
   *
   * @param  {Interfaces.StateAction} stateAction - action to change a state
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
    // Get an old value of the state (for command)
    const oldValue = KrixHelper.get(this.store, statePath);

    // Skip the `Set State` logic if the old state has the same value as the new state
    const stateActionCompareState = stateAction.options?.compare ?? false;
    if (stateActionCompareState === true && oldValue === stateAction.value) {
      return;
    }

    // Set the new state to the specific state if the `signal` flag is disabled
    const stateActionIsSignal = stateAction.options?.signal ?? false;
    if (stateActionIsSignal !== true) {
      KrixHelper.set(this.store, statePath, stateAction.value);
    }

    // Emit a `State Change` signal to the `State Changes` subject if it exists
    if (this.stateChangesSubjectMap.has(statePath) === true) {
      const sjStateChanges = this.stateChangesSubjectMap.get(statePath);
      sjStateChanges.next({
        oldValue: oldValue,
        newValue: stateAction.value,
      });
    }

    // Prepare and emit a `Store Command` signal (a `Set State` command) to the `Store Commands` subject
    const commandData: Interfaces.SetStateCommand = {
      statePath: statePath,
      state: stateAction.state,
      oldValue: oldValue,
      newValue: stateAction.value,
      options: stateAction.options,
    };

    this.sjStoreCommands.next({
      name: Enums.StoreCommandName.SetState,
      data: commandData,
    });
  }

  /**
   * Sets new state values to the store. This method calls the `Set State` logic for every state action.
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
   * Creates a state path from the state selector.
   *
   * @param  {string[]} stateSelector - parts of state path
   * @return {string} - state path
   */
  private getStatePath (
    stateSelector: string[],
  ): string {
    if (Array.isArray(stateSelector) === false) {
      return ``;
    }

    const statePath = stateSelector.join('.');
    return statePath;
  }
}
