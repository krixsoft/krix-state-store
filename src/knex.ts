import * as Rx from 'rxjs';
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

  getState<StateType = any> (state: string[]): StateType {
    return;
  }

  setState (stateActions: Interfaces.StateAction|Interfaces.StateAction[]) {
  }
}
