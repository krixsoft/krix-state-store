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
  }

  /**
   * Destroys Krix.
   * - stops all state watchers;
   * - sets store to empty object;
   *
   * @return {void}
   */
  destroy (): void {
    this.sjStopSignal.next(null);
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

    const obsStateChanges = this.sjStoreChanges
      .pipe(
        RxOp.filter((storeChange) => {
          return storeChange.statePath === statePath;
        }),
        RxOp.map((stateChange: Interfaces.StoreChange<StateType>) => {
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
   * @param  {string[]} state - parts of state path
   * @return {StateType}
   */
  getState <StateType = any> (
    state: string[],
  ): StateType {
    const statePath = this.getStatePath(state);
    const stateValue = this.getStateByPath(statePath);
    return stateValue;
  }

  /**
   * Returns state by state path.
   *
   * @param  {string} statePath - state path
   * @return {StateType}
   */
  getStateByPath <StateType = any> (
    statePath: string,
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
    const statePath = this.getStatePath(stateAction.state);
    const oldValue = KrixHelper.get(this.store, statePath);

    KrixHelper.set(this.store, statePath, stateAction.value);

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
