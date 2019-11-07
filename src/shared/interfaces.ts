
export interface StateAction {
  state: string[];
  value: any;
}

export interface KnexOptions <StoreType> {
  initStore: StoreType;
}
