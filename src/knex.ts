import * as Rx from 'rxjs';
import * as RxOp from 'rxjs/operators';
import * as _ from 'lodash';
import { Interfaces } from './shared';

export class Knex<T> {
  private store: any;
  private sjStoreChanges: Rx.BehaviorSubject<any>;

  static create <StoreType> (
    options?: Interfaces.StoreOptions<StoreType>,
  ): Knex<StoreType> {
    const inst = new Knex<StoreType>();
    inst.init();
    return inst;
  }

  private init () {
    this.sjStoreChanges = new Rx.BehaviorSubject(null);
  }

  select <StateType = any> (state: string[]): StateType {
    return;
  }

  getState <StateType = any> (state: string[]): StateType {
    const statePath = _.join(state, '.');
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
