import { Interfaces } from './shared';

export class Knex<T> {
  private store: T;

  static create <StoreType> (
    options?: Interfaces.StoreOptions<StoreType>,
  ): Knex<StoreType> {
    const inst = new Knex<StoreType>();
    return inst;
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
