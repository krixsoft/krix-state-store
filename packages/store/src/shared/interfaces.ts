
export interface StateAction {
  state: string[];
  value: any;
}

export interface KrixOptions <StoreType> {
  initStore: StoreType;
}

export interface StoreChange <StateType = any> {
  statePath: string;
  state: string[];
  oldValue: StateType;
  newValue: StateType;
}

export interface StateChange <StateType = any> {
  oldValue: StateType;
  newValue: StateType;
}
