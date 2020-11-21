import * as Enums from './enums';

export interface StateActionOptions {
  /**
   * If `signal` flag is enabled, `setState` won't save the new state to the state-store.
   */
  signal?: boolean;
  /**
   * If `compare` flag is enabled and the state isn't changed, `setState` won't do anything.
   */
  compare?: boolean;
  /**
   * If `merge` flag is enabled, `setState` will merge the state instead of replacing it.
   */
  merge?: boolean;
}

export interface StateAction {
  /**
   * Full path to the state in the state-store.
   * Eg: [ 'session', 'id' ] or [ 'user', 'name' ] or [ 'app', 'spinnerIsShown' ]
   */
  state: string[];
  /**
   * A value which we set to in the state.
   */
  value: any;
  /**
   * An action configuration.
   */
  options?: StateActionOptions;
}

export interface SetStateCommand {
  /**
   * The string representation of the path in the state-store where there is the new value.
   */
  statePath: string;
  /**
   * The array-like representation of the path in the state-store where there is the new value.
   */
  state: string[];
  /**
   * The value that there was in the state before the update.
   */
  oldValue: any;
  /**
   * The value that there is in the state after the update.
   */
  newValue: any;
  /**
   * An action configuration.
   */
  options?: StateActionOptions;
}

export interface StateChange {
  /**
   * The value that there was in the state before the update.
   */
  oldValue: any;
  /**
   * The value that there is in the state after the update.
   */
  newValue: any;
}

export type StoreCommandDataType = SetStateCommand;

export interface StoreCommand {
  name: Enums.StoreCommandName;
  data: StoreCommandDataType;
}
