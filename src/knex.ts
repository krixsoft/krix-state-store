import * as Rx from 'rxjs';
import * as RxOp from 'rxjs/operators';
import * as _ from 'lodash';
import { Interfaces } from './shared';

export class Knex<T> {
  /**
   * Knex store
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
  private options: Interfaces.KnexOptions<any>;

  /**
   * Creates instance of Knex.
   *
   * @static
   * @param  {Interfaces.KnexOptions<StoreType>} [options] - Knex options
   * @return Knex<StoreType>
   */
  static create <StoreType> (
    options?: Interfaces.KnexOptions<StoreType>,
  ): Knex<StoreType> {
    const inst = new Knex<StoreType>();
    inst.init(options);
    return inst;
  }

  constructor () {
    this.sjStoreChanges = new Rx.Subject();
    this.sjStopSignal = new Rx.Subject();
  }

  /**
   * Inits Knex.
   * - sets initial value of store;
   *
   * @param  {Interfaces.KnexOptions<StoreType>} [options] - Knex options
   * @return void
   */
  init <StoreType> (
    options?: Interfaces.KnexOptions<StoreType>,
  ): void {
    this.options = options;

    if (!_.isPlainObject(options)) {
      this.store = {};
      return;
    }

    this.store = _.isPlainObject(options.initStore)
      ? _.cloneDeep(options.initStore) : {};
  }

  /**
   * Destroys Knex.
   * - stops all state watchers;
   * - sets store to empty object;
   *
   * @return void
   */
  destroy (): void {
    this.sjStopSignal.next(null);
    this.store = {};
  }

  /**
   * Resets Knex to initial state.
   *
   * @return void
   */
  reset (): void {
    this.destroy();
    this.init(this.options);
  }

  /**
   * Returns state watcher - Observable which emits all changes of selected state.
   *
   * @param  {string[]} state - parts of state path
   * @param  {boolean} [onlyChanges=false] - emits only changes (without current state)
   * @return Rx.Observable<StateType>
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
   * @return StateType
   */
  getState <StateType = any> (
    state: string[],
  ): StateType {
    const statePath = this.getStatePath(state);
    return _.get(this.store, statePath);
  }

  /**
   * Returns state by state path.
   *
   * @param  {string} statePath - state path
   * @return StateType
   */
  getStateByPath <StateType = any> (
    statePath: string,
  ): StateType {
    return _.get(this.store, statePath);
  }

  /**
   * Sets new state using the state action.
   *
   * @param  {Interfaces.StateAction} stateAction - action to change state
   * @return void
   */
  setState (
    stateAction: Interfaces.StateAction,
  ): void {
    const statePath = this.getStatePath(stateAction.state);
    const oldValue = _.get(this.store, statePath);

    _.set(this.store, statePath, stateAction.value);

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
   * @return void
   */
  setStates (
    stateActions: Interfaces.StateAction[],
  ): void {
    _.forEach(stateActions, (stateAction) => {
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
   * @return string - State path
   */
  private getStatePath (
    state: string[],
  ): string {
    const statePath = _.join(state, '.');
    return statePath;
  }
}
