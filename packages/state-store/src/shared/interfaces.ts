import * as Enums from './enums';

export interface StateActionOptions {
  signal?: boolean;
  compare?: boolean;
}

export interface StateAction {
  state: string[];
  value: any;
  options?: StateActionOptions;
}

export interface KrixOptions <StoreType> {
  initStore: StoreType;
}

export interface StoreCommand <StoreCommandDataType = any> {
  name: Enums.StoreCommandName;
  data: StoreCommandDataType;
}

export interface SetStateCommand <StateType = any> {
  statePath: string;
  state: string[];
  oldValue: StateType;
  newValue: StateType;
  options?: StateActionOptions;
}

export interface StateChange <StateType = any> {
  oldValue: StateType;
  newValue: StateType;
}
