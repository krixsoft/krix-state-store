/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
// import * as sinon from 'sinon';
import * as Rx from 'rxjs';
import * as _ from 'lodash';

import { StateStore } from './state.store';
import { Interfaces } from './shared';

import { DoneAfterTickManager } from './spec/done-after-tick.manager';
import { SubscriptionManager } from './spec/subscription.manager';

describe(`StateStore`, () => {
  const mockStore = {
    id: 51,
    fName: `Ivan`,
    lName: `Ivanov`,
};

let stateStore: StateStore<any>;
beforeEach(() => {
  const mockStoreClone = _.clone({
    id: 51,
    fName: `Ivan`,
    lName: `Ivanov`,
  });
  stateStore = StateStore.create<any>();
  stateStore.setState({
    state: [ 'user' ],
    value: mockStoreClone,
  });
});

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
    describe(`when method is invoked without state`, () => {
      it('should return empty path', () => {
        const arg: any = undefined;
        const result = stateStore.getStatePath(arg);
        expect(result).to.equal(``);
      });
    });
    describe(`when method is invoked with non-array state`, () => {
      it('should return empty string', () => {
        const args: any[] = [ null, 0, ``, `Hello!`, { hello: `world` } ];
        args.forEach((arg: any) => {
          const result = stateStore.getStatePath(arg);
          expect(result).to.equal(``);
        });
      });
    });
    describe(`when method is invoked with empty array state`, () => {
      it('should return empty string', () => {
        const arg: any = [];
        const result = stateStore.getStatePath(arg);
        expect(result).to.equal(``);
      });
    });
    describe(`when method is invoked with non-empty array state`, () => {
      describe(`and state has one string values`, () => {
        it('should return correct non-empty string', () => {
          const arg: any = [ `hello` ];
          const result = stateStore.getStatePath(arg);
          expect(result).to.equal(`hello`);
        });
      });
      describe(`and parts of state have string values`, () => {
        it('should return correct non-empty string', () => {
          const arg: any = [ `hello`, `world` ];
          const result = stateStore.getStatePath(arg);
          expect(result).to.equal(`hello.world`);
        });
      });
      describe(`and parts of state have number values`, () => {
        it('should return correct non-empty string', () => {
          const arg: any = [ 4, 5 ];
          const result = stateStore.getStatePath(arg);
          expect(result).to.equal(`4.5`);
        });
      });
      describe(`and parts of state have object values`, () => {
        it('should return correct non-empty string', () => {
          const arg: any = [ { hello: `world` }, { a: `b` } ];
          const result = stateStore.getStatePath(arg);
          expect(result).to.equal(`[object Object].[object Object]`);
        });
      });
    });
  });

  describe(`getState`, () => {
    describe(`when method is invoked without state path`, () => {
      it('should return store', () => {
        const arg: any = undefined;
        const result = stateStore.getState(arg);
        expect(result).to.deep.equal({ user: mockStore });
      });
    });
    describe(`when method is invoked with non-string state path`, () => {
      it('should return store', () => {
        const args: any[] = [ null, 0, { hello: `world` } ];
        args.forEach((arg: any) => {
          const result = stateStore.getState(arg);
          expect(result).to.deep.equal({ user: mockStore });
        });
      });
    });
    describe(`when method is invoked with empty state path`, () => {
      it('should return store', () => {
        const arg: any = [];
        const result = stateStore.getState(arg);
        expect(result).to.deep.equal({ user: mockStore });
      });
    });
    describe(`when method is invoked with non-empty state path`, () => {
      describe(`and state exists in store`, () => {
        it('should return state', () => {
          const arg: any = `user.fName`;
          const result = stateStore.getState(arg);
          expect(result).to.equal(mockStore.fName);
        });
      });
      describe(`and state doesn't exist in store`, () => {
        it('should return undefined', () => {
          const arg: any = `user.mName`;
          const result = stateStore.getState(arg);
          expect(result).to.be.undefined;
        });
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
        const args: any[] = [ null, 0, ``, { hello: `world` } ];
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
    describe(`when method is invoked without state action`, () => {
      it('should throw error', () => {
        const resultError = new Error(`StateStore - setState: State action isn't exist`);
        let methodError: any;

        try {
          const arg: any = undefined;
          stateStore.setState(arg);
        } catch (error) {
          methodError = error;
          expect((error as Error).toString()).to.deep.equal(resultError.toString());
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
            expect((error as Error).toString()).to.deep.equal(resultError.toString());
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

          const oldFNameState = stateStore.getState([ `user`, `mName` ]);
          expect(oldFNameState).to.be.undefined;

          stateStore.setState(arg);

          const newFNameState = stateStore.getState([ `user`, `mName` ]);
          expect(newFNameState).to.equal(arg.value);
        });
      });
      describe(`and state is a path to existing property`, () => {
        it('should update property in the store', () => {
          const arg: Interfaces.StateAction = {
            state: [ `user`, `fName` ],
            value: `Dima`,
          };

          const oldFNameState = stateStore.getState([ `user`, `fName` ]);
          expect(oldFNameState).to.equal(mockStore.fName);

          stateStore.setState(arg);

          const newFNameState = stateStore.getState([ `user`, `fName` ]);
          expect(newFNameState).to.equal(arg.value);
        });
      });
      describe(`and state is a path to existing property and 'signal' flag is enabled`, () => {
        it(`shouldn't update property in the store`, () => {
          const arg: Interfaces.StateAction = {
            state: [ `user`, `fName` ],
            value: `Dima`,
            options: {
              signal: true,
            },
          };

          const oldFNameState = stateStore.getState([ `user`, `fName` ]);
          expect(oldFNameState).to.equal(mockStore.fName);

          stateStore.setState(arg);

          const newFNameState = stateStore.getState([ `user`, `fName` ]);
          expect(newFNameState).not.to.equal(arg.value);
        });
      });
      describe(`and state is a path to existing property and 'compare' flag is enabled`, () => {
        describe(`and state is changed`, () => {
          it('should update property in the store', () => {
            const arg: Interfaces.StateAction = {
              state: [ `user`, `fName` ],
              value: `Dima`,
              options: {
                compare: true,
              },
            };

            const oldFNameState = stateStore.getState([ `user`, `fName` ]);
            expect(oldFNameState).to.equal(mockStore.fName);

            stateStore.setState(arg);

            const newFNameState = stateStore.getState([ `user`, `fName` ]);
            expect(newFNameState).to.equal(arg.value);
          });
        });
        describe(`but state isn't changed`, () => {
          it(`shouldn't update property in the store`, () => {
            const arg: Interfaces.StateAction = {
              state: [ `user`, `fName` ],
              value: `Dima`,
              options: {
                compare: true,
              },
            };

            const oldFNameState = stateStore.getState([ `user`, `fName` ]);
            expect(oldFNameState).to.equal(mockStore.fName);

            stateStore.setState(arg);

            const newFNameState = stateStore.getState([ `user`, `fName` ]);
            expect(newFNameState).to.equal(arg.value);
          });
        });
      });

      describe(`and state is a path to existing non-object property and 'merge' flag is enabled`, () => {
        it('should update property in the store', () => {
          const arg: Interfaces.StateAction = {
            state: [ `user`, `fName` ],
            value: {
              mName: `Vova`,
            },
            options: {
              merge: true,
            },
          };

          const oldFNameState = stateStore.getState([ `user`, `fName` ]);
          expect(oldFNameState).to.equal(mockStore.fName);

          stateStore.setState(arg);

          const newFNameState = stateStore.getState([ `user`, `fName` ]);
          expect(newFNameState).to.equal(arg.value);
        });
      });
      describe(`and state is a path to existing object property and 'merge' flag is enabled`, () => {
        describe(`and we don't change old internal properties`, () => {
          it(`should merge property and don't change old internal properties`, () => {
            const arg: Interfaces.StateAction = {
              state: [ `user` ],
              value: {
                mName: `Vova`,
              },
              options: {
                merge: true,
              },
            };

            const oldFNameState = stateStore.getState([ `user`, `fName` ]);
            expect(oldFNameState).to.equal(mockStore.fName);
            const oldMNameState = stateStore.getState([ `user`, `mName` ]);
            expect(oldMNameState).to.be.undefined;

            stateStore.setState(arg);

            const newFNameState = stateStore.getState([ `user`, `fName` ]);
            expect(newFNameState).to.equal(mockStore.fName);
            const newMNameState = stateStore.getState([ `user`, `mName` ]);
            expect(newMNameState).to.equal(arg.value.mName);
          });
        });
        describe(`and we change old internal properties`, () => {
          it(`should merge property and change old internal properties`, () => {
            const arg: Interfaces.StateAction = {
              state: [ `user` ],
              value: {
                fName: `Oleg`,
                mName: `Vova`,
              },
              options: {
                merge: true,
              },
            };

            const oldFNameState = stateStore.getState([ `user`, `fName` ]);
            expect(oldFNameState).to.equal(mockStore.fName);
            const oldMNameState = stateStore.getState([ `user`, `mName` ]);
            expect(oldMNameState).to.be.undefined;

            stateStore.setState(arg);

            const newFNameState = stateStore.getState([ `user`, `fName` ]);
            expect(newFNameState).to.equal(arg.value.fName);
            const newMNameState = stateStore.getState([ `user`, `mName` ]);
            expect(newMNameState).to.equal(arg.value.mName);
          });
        });
      });
    });
  });

  describe(`select`, () => {
    const subManager = new SubscriptionManager();

    afterEach(() => {
      subManager.destroy();
    });

    describe(`where state is an empty array`, () => {
      it('should respond only to full store change', (done) => {
        const doneAfterTick = DoneAfterTickManager.create(done);
        const ssObserver1$ = stateStore.select([])
          .subscribe((store) => {
            const tick = doneAfterTick.getTick();
            if (tick === 0) {
              expect(store?.user?.fName).to.equal('Ivan');
              expect(store?.user?.lName).to.equal('Ivanov');
              return;
            }

            if (tick === 1) {
              expect(store?.user?.fName).to.equal('Igor');
              return;
            }

            if (tick === 2) {
              doneAfterTick.done(`Tick updates 'user.fName' property.`);
              return;
            }

            if (tick === 3) {
              expect(store?.user?.fName).to.be.undefined;
              expect(store?.user?.lName).to.equal('Dima');
              doneAfterTick.done();
              return;
            }
          });
        subManager.subscribe(ssObserver1$);
        const ssObserver2$ = stateStore.select([ 'user', 'fName' ])
          .subscribe((fName) => {
            const tick = doneAfterTick.getTick();
            const store = stateStore.getState();
            if (tick === 0) {
              expect(fName).to.equal('Ivan');
              expect(store?.user?.fName).to.equal('Ivan');
              return;
            }

            if (tick === 1) {
              doneAfterTick.done(`Tick updates 'user' ('.fName') property without 'merge' option.`);
              return;
            }

            if (tick === 2) {
              expect(fName).to.equal('Vova');
              expect(store?.user?.fName).to.equal('Vova');
              return;
            }

            if (tick === 3) {
              doneAfterTick.done(`Tick updates 'user' ('.lName') property.`);
              return;
            }
          });
        subManager.subscribe(ssObserver2$);
        doneAfterTick.nextTick();

        stateStore.setState({
          state: [],
          value: {
            user: {
              fName: 'Igor',
            },
          },
        });
        doneAfterTick.nextTick();

        stateStore.setState({
          state: [ 'user', 'fName' ],
          value: 'Vova',
        });
        doneAfterTick.nextTick();

        stateStore.setState({
          state: [],
          value: {
            user: {
              lName: 'Dima',
            },
          },
        });
        doneAfterTick.nextTick();
      });
    });
    describe(`where state is a path to non-existing property`, () => {
      it('should create new property in the store', (done) => {
        const doneAfterTick = DoneAfterTickManager.create(done);
        const ssObserver$ = stateStore.select([ 'user', 'mName' ])
          .subscribe((mName) => {
            const tick = doneAfterTick.getTick();
            const store = stateStore.getState();
            if (tick === 0) {
              expect(mName).to.be.undefined;
              expect(store?.user?.mName).to.be.undefined;
              expect(store?.user?.fName).to.equal('Ivan');
              expect(store?.user?.lName).to.equal('Ivanov');
              return;
            }

            if (tick === 1) {
              expect(mName).to.equal('Vova');
              expect(store?.user?.mName).to.equal('Vova');
              return;
            }

            if (tick === 2) {
              doneAfterTick.done(`Tick updates 'user.lName' property.`);
              return;
            }

            if (tick === 3) {
              expect(mName).to.equal('Vova');
              expect(store?.user?.mName).to.equal('Vova');
              expect(store?.user?.lName).to.equal('Vova');
              doneAfterTick.done();
              return;
            }
          });
        subManager.subscribe(ssObserver$);
        doneAfterTick.nextTick();

        stateStore.setState({
          state: [ 'user', 'mName' ],
          value: 'Vova',
        });
        doneAfterTick.nextTick();

        stateStore.setState({
          state: [ 'user', 'lName' ],
          value: 'Vova',
        });
        doneAfterTick.nextTick();

        stateStore.setState({
          state: [ 'user', 'mName' ],
          value: 'Vova',
        });
        doneAfterTick.nextTick();
      });
    });
    describe(`where state is a path to existing property`, () => {
      it('should update property in the store', (done) => {
        const doneAfterTick = DoneAfterTickManager.create(done);
        const ssObserver$ = stateStore.select([ 'user', 'fName' ])
          .subscribe((fName) => {
            const tick = doneAfterTick.getTick();
            const store = stateStore.getState();
            if (tick === 0) {
              expect(fName).to.equal('Ivan');
              expect(store?.user?.fName).to.equal('Ivan');
              expect(store?.user?.lName).to.equal('Ivanov');
              return;
            }

            if (tick === 1) {
              expect(fName).to.equal('Vova');
              expect(store?.user?.fName).to.equal('Vova');
              return;
            }

            if (tick === 2) {
              doneAfterTick.done(`Tick updates 'user.lName' property.`);
              return;
            }

            if (tick === 3) {
              expect(fName).to.equal('Vova');
              expect(store?.user?.fName).to.equal('Vova');
              expect(store?.user?.lName).to.equal('Vova');
              doneAfterTick.done();
              return;
            }
          });
        subManager.subscribe(ssObserver$);
        doneAfterTick.nextTick();

        stateStore.setState({
          state: [ 'user', 'fName' ],
          value: 'Vova',
        });
        doneAfterTick.nextTick();

        stateStore.setState({
          state: [ 'user', 'lName' ],
          value: 'Vova',
        });
        doneAfterTick.nextTick();

        stateStore.setState({
          state: [ 'user', 'fName' ],
          value: 'Vova',
        });
        doneAfterTick.nextTick();
      });
    });
    describe(`where state is a path to existing property and 'signal' flag is enabled`, () => {
      it(`shouldn't update property in the store`, (done) => {
        const doneAfterTick = DoneAfterTickManager.create(done);
        const ssObserver$ = stateStore.select([ 'user', 'mName' ])
          .subscribe((mName) => {
            const tick = doneAfterTick.getTick();
            const store = stateStore.getState();
            if (tick === 0) {
              expect(mName).to.be.undefined;
              expect(store?.user?.mName).to.be.undefined;
              expect(store?.user?.fName).to.equal('Ivan');
              expect(store?.user?.lName).to.equal('Ivanov');
              return;
            }

            if (tick === 1) {
              expect(mName).to.equal('Vova');
              expect(store?.user?.mName).to.be.undefined;
              return;
            }

            if (tick === 2) {
              doneAfterTick.done(`Tick updates 'user.lName' property.`);
              return;
            }

            if (tick === 3) {
              expect(mName).to.equal('Vova');
              expect(store?.user?.mName).to.be.undefined;
              expect(store?.user?.lName).to.equal('Vova');
              doneAfterTick.done();
              return;
            }
          });
        subManager.subscribe(ssObserver$);
        doneAfterTick.nextTick();

        stateStore.setState({
          state: [ 'user', 'mName' ],
          value: 'Vova',
          options: {
            signal: true,
          },
        });
        doneAfterTick.nextTick();

        stateStore.setState({
          state: [ 'user', 'lName' ],
          value: 'Vova',
        });
        doneAfterTick.nextTick();

        stateStore.setState({
          state: [ 'user', 'mName' ],
          value: 'Vova',
          options: {
            signal: true,
          },
        });
        subManager.subscribe(ssObserver$);
        doneAfterTick.nextTick();
      });
    });
    describe(`where state is a path to existing property and 'compare' flag is enabled`, () => {
      describe(`and state is changed`, () => {
        it('should update property in the store', (done) => {
          const doneAfterTick = DoneAfterTickManager.create(done);
          const ssObserver$ = stateStore.select([ 'user', 'fName' ])
            .subscribe((fName) => {
              const tick = doneAfterTick.getTick();
              const store = stateStore.getState();
              if (tick === 0) {
                expect(fName).to.equal('Ivan');
                expect(store?.user?.fName).to.equal('Ivan');
                expect(store?.user?.lName).to.equal('Ivanov');
                return;
              }

              if (tick === 1) {
                expect(fName).to.equal('Vova');
                expect(store?.user?.fName).to.equal('Vova');
                return;
              }

              if (tick === 2) {
                doneAfterTick.done(`Tick updates 'user.lName' property.`);
                return;
              }

              if (tick === 3) {
                expect(fName).to.equal('Andrey');
                expect(store?.user?.fName).to.equal('Andrey');
                expect(store?.user?.lName).to.equal('Vova');
                doneAfterTick.done();
                return;
              }
            });
          subManager.subscribe(ssObserver$);
          doneAfterTick.nextTick();

          stateStore.setState({
            state: [ 'user', 'fName' ],
            value: 'Vova',
            options: {
              compare: true,
            },
          });
          doneAfterTick.nextTick();

          stateStore.setState({
            state: [ 'user', 'lName' ],
            value: 'Vova',
          });
          doneAfterTick.nextTick();

          stateStore.setState({
            state: [ 'user', 'fName' ],
            value: 'Andrey',
            options: {
              compare: true,
            },
          });
          doneAfterTick.nextTick();
        });
      });
      describe(`but state isn't changed`, () => {
        it(`shouldn't update property in the store`, (done) => {
          const doneAfterTick = DoneAfterTickManager.create(done);
          const ssObserver$ = stateStore.select([ 'user', 'fName' ])
            .subscribe((fName) => {
              const tick = doneAfterTick.getTick();
              const store = stateStore.getState();
              if (tick === 0) {
                expect(fName).to.equal('Ivan');
                expect(store?.user?.fName).to.equal('Ivan');
                expect(store?.user?.lName).to.equal('Ivanov');
                return;
              }

              if (tick === 1) {
                doneAfterTick.done(`Tick updates 'user.fName' property but it the same.`);
                return;
              }

              if (tick === 2) {
                doneAfterTick.done(`Tick updates 'user.lName' property.`);
                return;
              }

              if (tick === 3) {
                expect(fName).to.equal('Andrey');
                expect(store?.user?.fName).to.equal('Andrey');
                expect(store?.user?.lName).to.equal('Vova');
                doneAfterTick.done();
                return;
              }
            });
          subManager.subscribe(ssObserver$);
          doneAfterTick.nextTick();

          stateStore.setState({
            state: [ 'user', 'fName' ],
            value: 'Ivan',
            options: {
              compare: true,
            },
          });
          doneAfterTick.nextTick();

          stateStore.setState({
            state: [ 'user', 'lName' ],
            value: 'Vova',
          });
          doneAfterTick.nextTick();

          stateStore.setState({
            state: [ 'user', 'fName' ],
            value: 'Andrey',
            options: {
              compare: true,
            },
          });
          doneAfterTick.nextTick();
        });
      });
    });

    describe(`where state is a path to existing non-object property and 'merge' flag is enabled`, () => {
      it('should update property in the store', (done) => {
        const doneAfterTick = DoneAfterTickManager.create(done);
        const ssObserver$ = stateStore.select([ 'user', 'fName' ])
          .subscribe((fName) => {
            const tick = doneAfterTick.getTick();
            const store = stateStore.getState();
            if (tick === 0) {
              expect(fName).to.equal('Ivan');
              expect(store?.user?.fName).to.equal('Ivan');
              expect(store?.user?.lName).to.equal('Ivanov');
              return;
            }

            if (tick === 1) {
              expect(fName?.mName).to.equal('Vova');
              expect(store?.user?.fName?.mName).to.equal('Vova');
              return;
            }

            if (tick === 2) {
              doneAfterTick.done(`Tick updates 'user.lName' property.`);
              return;
            }

            if (tick === 3) {
              expect(fName).to.equal('Vova');
              expect(store?.user?.fName).to.equal('Vova');
              expect(store?.user?.lName).to.equal('Vova');
              doneAfterTick.done();
              return;
            }
          });
        subManager.subscribe(ssObserver$);
        doneAfterTick.nextTick();

        stateStore.setState({
          state: [ `user`, `fName` ],
          value: {
            mName: `Vova`,
          },
          options: {
            merge: true,
          },
        });
        doneAfterTick.nextTick();

        stateStore.setState({
          state: [ 'user', 'lName' ],
          value: 'Vova',
        });
        doneAfterTick.nextTick();

        stateStore.setState({
          state: [ `user`, `fName` ],
          value: `Vova`,
          options: {
            merge: true,
          },
        });
        doneAfterTick.nextTick();
      });
    });
    describe(`where state is a path to existing object property and 'merge' flag is enabled`, () => {
      describe(`and we don't change old internal properties`, () => {
        it(`should merge property and don't change old internal properties`, (done) => {
          const doneAfterTick = DoneAfterTickManager.create(done);
          const ssObserver1$ = stateStore.select([ 'user' ])
            .subscribe((user) => {
              const tick = doneAfterTick.getTick();
              const store = stateStore.getState();
              if (tick === 0) {
                expect(store?.user?.fName).to.equal('Ivan');
                expect(store?.user?.mName).to.be.undefined;
                expect(store?.user?.lName).to.equal('Ivanov');
                return;
              }

              if (tick === 1) {
                expect(store?.user?.fName).to.equal('Ivan');
                expect(store?.user?.mName).to.equal('Vova');
                expect(store?.user?.lName).to.equal('Ivanov');
                return;
              }

              if (tick === 2) {
                doneAfterTick.done(`Tick updates 'user.lName' property.`);
                return;
              }

              if (tick === 3) {
                expect(store?.user?.fName).to.equal('Ivan');
                expect(store?.user?.mName).to.equal('Vova');
                expect(store?.user?.lName).to.equal('Dima');
                doneAfterTick.done();
                return;
              }
            });
          subManager.subscribe(ssObserver1$);
          const ssObserver2$ = stateStore.select([ 'user', 'lName' ])
            .subscribe((lName) => {
              const store = stateStore.getState();
              const tick = doneAfterTick.getTick();
              if (tick === 0) {
                expect(lName).to.equal('Ivanov');
                expect(store?.user?.lName).to.equal('Ivanov');
                return;
              }

              if (tick === 1) {
                doneAfterTick.done(`Tick updates 'user' ('.mName') property.`);
                return;
              }

              if (tick === 2) {
                expect(lName).to.equal('Dima');
                expect(store?.user?.lName).to.equal('Dima');
                return;
              }

              if (tick === 3) {
                doneAfterTick.done(`Tick updates 'user' ('.mName') property.`);
                return;
              }
            });
          subManager.subscribe(ssObserver2$);
          const ssObserver3$ = stateStore.select([ 'user', 'mName' ])
            .subscribe((mName) => {
              const store = stateStore.getState();
              const tick = doneAfterTick.getTick();
              if (tick === 0) {
                expect(mName).to.be.undefined;
                expect(store?.user?.mName).to.be.undefined;
                return;
              }

              if (tick === 1) {
                expect(mName).to.equal('Vova');
                expect(store?.user?.mName).to.equal('Vova');
                return;
              }

              if (tick === 2) {
                doneAfterTick.done(`Tick updates 'user.lName' property.`);
                return;
              }

              if (tick === 3) {
                expect(mName).to.equal('Vova');
                expect(store?.user?.mName).to.equal('Vova');
                doneAfterTick.done();
                return;
              }
            });
          subManager.subscribe(ssObserver3$);
          doneAfterTick.nextTick();

          stateStore.setState({
            state: [ `user` ],
            value: {
              mName: `Vova`,
            },
            options: {
              merge: true,
            },
          });
          doneAfterTick.nextTick();

          stateStore.setState({
            state: [ 'user', 'lName' ],
            value: 'Dima',
          });
          doneAfterTick.nextTick();

          stateStore.setState({
            state: [ `user` ],
            value: {
              mName: `Vova`,
            },
            options: {
              merge: true,
            },
          });
          doneAfterTick.nextTick();
        });
      });
      describe(`and we change old internal properties`, () => {
        it(`should merge property and change old internal properties`, (done) => {
          const doneAfterTick = DoneAfterTickManager.create(done);
          const ssObserver1$ = stateStore.select([ 'user' ])
            .subscribe((user) => {
              const tick = doneAfterTick.getTick();
              const store = stateStore.getState();
              if (tick === 0) {
                expect(store?.user?.fName).to.equal('Ivan');
                expect(store?.user?.lName).to.equal('Ivanov');
                return;
              }

              if (tick === 1) {
                expect(store?.user?.fName).to.equal('Oleg');
                expect(store?.user?.lName).to.equal('Ivanov');
                return;
              }

              if (tick === 2) {
                doneAfterTick.done(`Tick updates 'user.lName' property.`);
                return;
              }

              if (tick === 3) {
                expect(store?.user?.fName).to.equal('Vova');
                expect(store?.user?.lName).to.equal('Dima');
                doneAfterTick.done();
                return;
              }
            });
          subManager.subscribe(ssObserver1$);
          const ssObserver2$ = stateStore.select([ 'user', 'fName' ])
            .subscribe((fName) => {
              const store = stateStore.getState();
              const tick = doneAfterTick.getTick();
              if (tick === 0) {
                expect(fName).to.equal('Ivan');
                expect(store?.user?.fName).to.equal('Ivan');
                return;
              }

              if (tick === 1) {
                expect(fName).to.equal('Oleg');
                expect(store?.user?.fName).to.equal('Oleg');
                return;
              }

              if (tick === 2) {
                doneAfterTick.done(`Tick updates 'user.lName' property.`);
                return;
              }

              if (tick === 3) {
                expect(fName).to.equal('Vova');
                expect(store?.user?.fName).to.equal('Vova');
                doneAfterTick.done();
                return;
              }
            });
          subManager.subscribe(ssObserver2$);
          const ssObserver3$ = stateStore.select([ 'user', 'lName' ])
            .subscribe((lName) => {
              const store = stateStore.getState();
              const tick = doneAfterTick.getTick();
              if (tick === 0) {
                expect(lName).to.equal('Ivanov');
                expect(store?.user?.lName).to.equal('Ivanov');
                return;
              }

              if (tick === 1) {
                doneAfterTick.done(`Tick updates 'user' ('.fName') property.`);
                return;
              }

              if (tick === 2) {
                expect(lName).to.equal('Dima');
                expect(store?.user?.lName).to.equal('Dima');
                return;
              }

              if (tick === 3) {
                doneAfterTick.done(`Tick updates 'user' ('.fName') property.`);
                return;
              }
            });
          subManager.subscribe(ssObserver3$);
          doneAfterTick.nextTick();

          stateStore.setState({
            state: [ `user` ],
            value: {
              fName: `Oleg`,
            },
            options: {
              merge: true,
            },
          });
          doneAfterTick.nextTick();

          stateStore.setState({
            state: [ 'user', 'lName' ],
            value: 'Dima',
          });
          doneAfterTick.nextTick();

          stateStore.setState({
            state: [ `user` ],
            value: {
              fName: `Vova`,
            },
            options: {
              merge: true,
            },
          });
          doneAfterTick.nextTick();
        });
      });
    });
  });
});
