import { Krix } from '../krix';

import { InitPodiumStore, PodiumStore } from './podium.store';

export interface KrixStore {
  podium: PodiumStore;
}

export const InitKrixStore = {
  podium: InitPodiumStore,
};

export const krixStore = Krix.create<KrixStore>({
  initStore: InitKrixStore,
});
