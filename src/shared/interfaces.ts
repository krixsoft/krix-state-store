
export interface StateAction {
  state: string[];
  value: any;
}

export interface StoreOptions<StoreType> {
  initStore: StoreType;
}
