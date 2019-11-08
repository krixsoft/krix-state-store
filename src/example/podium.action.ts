import { krixStore } from './store';

class PodiumAction {

  setVoting (voting: any) {
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

  setPodiumModalCoords (x: number, y: number) {
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
