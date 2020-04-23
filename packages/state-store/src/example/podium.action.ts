import { stateStore } from './store';

export class PodiumAction {

  setVoting (voting: any): void {
    const stateVotingId = stateStore
      .getState([ 'podium', 'votingId' ]);

    if (stateVotingId === voting) {
      return;
    }

    stateStore.setState({
      state: [ 'podium', 'votingId' ],
      value: voting,
    });
  }

  setPodiumModalCoords (x: number, y: number): void {
    stateStore.setStates([
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
