import { knexStore } from './store';

class PodiumAction {

  setVoting (voting: any) {
    const stateVotingId = knexStore
      .getState([ 'podium', 'votingId' ]);

    if (stateVotingId === voting) {
      return;
    }

    knexStore.setState({
      state: [ 'podium', 'votingId' ],
      value: voting,
    });
  }

  setPodiumModalCoords (x: number, y: number) {
    knexStore.setStates([
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
