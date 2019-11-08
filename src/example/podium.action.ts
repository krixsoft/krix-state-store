import { krixStore } from './store';

export class PodiumAction {

  setVoting (voting: any): void {
    const stateVotingId = krixStore
      .getState([ 'podium', 'votingId' ]);

    if (stateVotingId === voting) {
      return;
    }

    krixStore.setState({
      state: [ 'podium', 'votingId' ],
      value: voting,
    });
  }

  setPodiumModalCoords (x: number, y: number): void {
    krixStore.setStates([
      {
        state: [ 'podium', 'modalX' ],
        value: x,
      },
      {
        state: [ 'podium', 'modalY' ],
        value: y,
      },
    ]);
  }
}
