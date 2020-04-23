import { StateStore } from '../state.store';

import { InitPodiumStore, PodiumStore } from './podium.store';

export interface KrixStore {
  podium: PodiumStore;
}

export const InitKrixStore = {
  podium: InitPodiumStore,
};

export const stateStore = StateStore.create<KrixStore>({
  initStore: InitKrixStore,
});
