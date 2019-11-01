import { Knex } from '../knex';

import { InitPodiumStore, PodiumStore } from './podium.store';

export interface KnexStore {
  podium: PodiumStore;
}

export const InitKnexStore = {
  podium: InitPodiumStore,
};

export const knexStore = Knex.create<KnexStore>({
  initStore: InitKnexStore,
});
