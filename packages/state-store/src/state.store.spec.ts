/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
// import * as sinon from 'sinon';
import * as Rx from 'rxjs';

import { StateStore } from './state.store';
import { Interfaces } from './shared';

describe(`StateStore`, () => {
  describe(`create`, () => {
    describe(`when method is invoked`, () => {
      it('should return instance of StateStore', () => {
        const krixInst = StateStore.create();
        expect(krixInst).to.be.an.instanceOf(StateStore);
      });
    });
  });

  describe(`new`, () => {
    describe(`when instance of class is created`, () => {
      it('should create "sjStoreChanges" and "sjStopSignal" RxJS Subjects', () => {
        const krixInst = new StateStore();
        expect(krixInst['sjStoreCommands']).to.be.an.instanceOf(Rx.Subject);
      });
    });
  });

  describe(`getStatePath`, () => {
    let stateStore: StateStore<any>;
    beforeEach(() => {
      stateStore = new StateStore();
    });

    describe(`when method is invoked without state`, () => {
      it('should return empty path', () => {
        const arg: any = undefined;
        const result = stateStore['getStatePath'](arg);
        expect(result).to.equal(``);
      });
    });
    describe(`when method is invoked with non-array state`, () => {
      it('should return empty string', () => {
        const args: any[] = [ null, 0, ``, `Hello!`, { hello: `world` } ];
        args.forEach((arg: any) => {
          const result = stateStore['getStatePath'](arg);
          expect(result).to.equal(``);
        });
      });
    });
    describe(`when method is invoked with empty array state`, () => {
      it('should return empty string', () => {
        const arg: any = [];
        const result = stateStore['getStatePath'](arg);
        expect(result).to.equal(``);
      });
    });
    describe(`when method is invoked with non-empty array state`, () => {
      describe(`and state has one string values`, () => {
        it('should return correct non-empty string', () => {
          const arg: any = [ `hello` ];
          const result = stateStore['getStatePath'](arg);
          expect(result).to.equal(`hello`);
        });
      });
      describe(`and parts of state have string values`, () => {
        it('should return correct non-empty string', () => {
          const arg: any = [ `hello`, `world` ];
          const result = stateStore['getStatePath'](arg);
          expect(result).to.equal(`hello.world`);
        });
      });
      describe(`and parts of state have number values`, () => {
        it('should return correct non-empty string', () => {
          const arg: any = [ 4, 5 ];
          const result = stateStore['getStatePath'](arg);
          expect(result).to.equal(`4.5`);
        });
      });
      describe(`and parts of state have object values`, () => {
        it('should return correct non-empty string', () => {
          const arg: any = [ { hello: `world` }, { a: `b` } ];
          const result = stateStore['getStatePath'](arg);
          expect(result).to.equal(`[object Object].[object Object]`);
        });
      });
    });
  });

  describe(`getStateByPath`, () => {
    const mockStore = {
        id: 51,
        fName: `Ivan`,
        lName: `Ivanov`,
    };

    let stateStore: StateStore<any>;
    beforeEach(() => {
      stateStore = StateStore.create<any>();
      stateStore.setState({
        state: [ 'user' ],
        value: mockStore,
      });
    });

    describe(`when method is invoked without state path`, () => {
      it('should return store', () => {
        const arg: any = undefined;
        const result = stateStore.getStateByPath(arg);
        expect(result).to.deep.equal({ user: mockStore });
      });
    });
    describe(`when method is invoked with non-string state path`, () => {
      it('should return store', () => {
        const args: any[] = [ null, 0, [ `Hello!` ], { hello: `world` } ];
        args.forEach((arg: any) => {
          const result = stateStore.getStateByPath(arg);
          expect(result).to.deep.equal({ user: mockStore });
        });
      });
    });
    describe(`when method is invoked with empty state path`, () => {
      it('should return store', () => {
        const arg: any = [];
        const result = stateStore.getStateByPath(arg);
        expect(result).to.deep.equal({ user: mockStore });
      });
    });
    describe(`when method is invoked with non-empty state path`, () => {
      describe(`and state exists in store`, () => {
        it('should return state', () => {
          const arg: any = `user.fName`;
          const result = stateStore.getStateByPath(arg);
          expect(result).to.equal(mockStore.fName);
        });
      });
      describe(`and state doesn't exist in store`, () => {
        it('should return undefined', () => {
          const arg: any = `user.mName`;
          const result = stateStore.getStateByPath(arg);
          expect(result).to.be.undefined;
        });
      });
    });
  });

  describe(`getState`, () => {
    const mockStore = {
        id: 51,
        fName: `Ivan`,
        lName: `Ivanov`,
    };

    let stateStore: StateStore<any>;
    beforeEach(() => {
      stateStore = StateStore.create<any>();
      stateStore.setState({
        state: [ 'user' ],
        value: mockStore,
      });
    });

    describe(`when method is invoked without state`, () => {
      it('should return store', () => {
        const arg: any = undefined;
        const result = stateStore.getState(arg);
        expect(result).to.deep.equal({ user: mockStore });
      });
    });
    describe(`when method is invoked with non-array state`, () => {
      it('should return store', () => {
        const args: any[] = [ null, 0, ``, `Hello!`, { hello: `world` } ];
        args.forEach((arg: any) => {
          const result = stateStore.getState(arg);
          expect(result).to.deep.equal({ user: mockStore });
        });
      });
    });
    describe(`when method is invoked with empty array state`, () => {
      it('should return store', () => {
        const arg: any = [];
        const result = stateStore.getState(arg);
        expect(result).to.deep.equal({ user: mockStore });
      });
    });
    describe(`when method is invoked with non-empty array state`, () => {
      describe(`and state exists in store`, () => {
        it('should return state', () => {
          const arg: any = [ `user`, `fName` ];
          const result = stateStore.getState(arg);
          expect(result).to.equal(mockStore.fName);
        });
      });
      describe(`and state doesn't exist in store`, () => {
        it('should return undefined', () => {
          const arg: any = [ `user`, `mName` ];
          const result = stateStore.getState(arg);
          expect(result).to.be.undefined;
        });
      });
    });
  });

  describe(`setState`, () => {
    const mockStore = {
        id: 51,
        fName: `Ivan`,
        lName: `Ivanov`,
    };

    let stateStore: StateStore<any>;
    beforeEach(() => {
      stateStore = StateStore.create<any>();
      stateStore.setState({
        state: [ 'user' ],
        value: mockStore,
      });
    });

    describe(`when method is invoked without state action`, () => {
      it('should throw error', () => {
        const resultError = new Error(`StateStore - setState: State action isn't exist`);
        let methodError: any;

        try {
          const arg: any = undefined;
          stateStore.setState(arg);
        } catch (error) {
          methodError = error;
          expect(error.toString()).to.deep.equal(resultError.toString());
        }

        expect(methodError).to.not.null;
        expect(methodError).to.not.undefined;
      });
    });

    describe(`when method is invoked with state action`, () => {
      describe(`but state doesn't have an 'array' type`, () => {
        it('should throw error', () => {
          const resultError = new Error(`StateStore - setState: State doesn't have an 'array' type`);
          let methodError: any;

          try {
            const arg: any = {};
            stateStore.setState(arg);
          } catch (error) {
            methodError = error;
            expect(error.toString()).to.deep.equal(resultError.toString());
          }

          expect(methodError).to.not.null;
          expect(methodError).to.not.undefined;
        });
      });
      describe(`and state is an empty array`, () => {
        it('should not update store', () => {
          const arg: Interfaces.StateAction = {
            state: [],
            value: `Hello World!`,
          };

          stateStore.setState(arg);
          const result = stateStore.getState();
          expect(result).to.deep.equal({ user: mockStore });
        });
      });
      describe(`and state is a path to non-existing property`, () => {
        it('should create new property in the store', () => {
          const arg: Interfaces.StateAction = {
            state: [ `user`, `mName` ],
            value: `Dima`,
          };

          const oldStore = stateStore.getState();
          expect(oldStore[arg.state[0]][arg.state[1]])
            .to.be.undefined;

          stateStore.setState(arg);

          const newStore = stateStore.getState();
          expect(newStore[arg.state[0]][arg.state[1]])
            .to.equal(arg.value);
        });
      });
      describe(`and state is a path to existing property`, () => {
        it('should update property in the store', () => {
          const arg: Interfaces.StateAction = {
            state: [ `user`, `fName` ],
            value: `Dima`,
          };

          const oldStore = stateStore.getState();
          expect(oldStore[arg.state[0]][arg.state[1]])
            .to.equal((mockStore as any)[arg.state[1]]);

          stateStore.setState(arg);

          const newStore = stateStore.getState();
          expect(newStore[arg.state[0]][arg.state[1]])
            .to.equal(arg.value);
        });
      });
    });
  });
});
