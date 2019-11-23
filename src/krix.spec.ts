/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
// import * as sinon from 'sinon';
import * as Rx from 'rxjs';

import { Krix } from './krix';

describe(`Krix`, () => {
  describe(`create`, () => {
    describe(`when method is invoked`, () => {
      it('should return instance of Krix', () => {
        const krixInst = Krix.create();
        expect(krixInst).to.be.an.instanceOf(Krix);
      });
    });
  });

  describe(`new`, () => {
    describe(`when instance of class is created`, () => {
      it('should create "sjStoreChanges" and "sjStopSignal" RxJS Subjects', () => {
        const krixInst = new Krix();
        expect(krixInst['sjStoreChanges']).to.be.an.instanceOf(Rx.Subject);
        expect(krixInst['sjStopSignal']).to.be.an.instanceOf(Rx.Subject);
      });
    });
  });

  let krix: Krix<any>;
  beforeEach(() => {
    krix = new Krix();
  });

  describe(`init`, () => {
    describe(`when method is invoked without options`, () => {
      it('should set "options" property in instance to empty object', () => {
        const options: any = undefined;
        krix.init(options);
        expect(krix[`options`]).to.be.an(`object`);
      });
    });
    describe(`when method is invoked with null instead of options`, () => {
      it('should set "options" property in instance to empty object', () => {
        const options: any = null;
        krix.init(options);
        expect(krix[`options`]).to.be.an(`object`);
      });
    });
    describe(`when method is invoked with array instead of options`, () => {
      it('should set "options" property in instance to empty object', () => {
        const options: any = [];
        krix.init(options);
        expect(krix[`options`]).to.be.an(`object`);
      });
    });
    describe(`when method is invoked with options`, () => {
      it('should set "options" property in instance to copy of options', () => {
        const options: any = {
          coolOptions: `option`,
        };
        krix.init(options);
        expect(krix[`options`]).to.deep.equal(options);
      });
      describe(`and options doesn't have "initStore" property`, () => {
        it('should set "store" property in instance to empty object', () => {
          const options: any = {
            coolOptions: `option`,
          };
          expect(krix[`store`]).to.be.undefined;
          krix.init(options);
          expect(krix[`store`]).to.be.an(`object`);
        });
      });
      describe(`and options has "initStore" property`, () => {
        it('should set "store" property in instance to copy of "initStore" property', () => {
          const options: any = {
            coolOptions: `option`,
            initStore: {
              'megaStore': {
                hello: 'World!',
              },
            },
          };
          expect(krix[`store`]).to.be.undefined;
          krix.init(options);
          expect(krix[`store`].megaStore.hello).to.equal(options.initStore.megaStore.hello);
        });
      });
    });
  });

  describe(`getStatePath`, () => {
    describe(`when method is invoked without state`, () => {
      it('should return empty path', () => {
        const arg: any = undefined;
        const result = krix['getStatePath'](arg);
        expect(result).to.equal(``);
      });
    });
    describe(`when method is invoked with non-array state`, () => {
      it('should return empty string', () => {
        const args: any[] = [ null, 0, ``, `Hello!`, { hello: `world` } ];
        args.forEach((arg: any) => {
          const result = krix['getStatePath'](arg);
          expect(result).to.equal(``);
        });
      });
    });
    describe(`when method is invoked with empty array state`, () => {
      it('should return empty string', () => {
        const arg: any = [];
        const result = krix['getStatePath'](arg);
        expect(result).to.equal(``);
      });
    });
    describe(`when method is invoked with non-empty array state`, () => {
      describe(`and state has one string values`, () => {
        it('should return correct non-empty string', () => {
          const arg: any = [ `hello` ];
          const result = krix['getStatePath'](arg);
          expect(result).to.equal(`hello`);
        });
      });
      describe(`and parts of state have string values`, () => {
        it('should return correct non-empty string', () => {
          const arg: any = [ `hello`, `world` ];
          const result = krix['getStatePath'](arg);
          expect(result).to.equal(`hello.world`);
        });
      });
      describe(`and parts of state have number values`, () => {
        it('should return correct non-empty string', () => {
          const arg: any = [ 4, 5 ];
          const result = krix['getStatePath'](arg);
          expect(result).to.equal(`4.5`);
        });
      });
      describe(`and parts of state have object values`, () => {
        it('should return correct non-empty string', () => {
          const arg: any = [ { hello: `world` }, { a: `b` } ];
          const result = krix['getStatePath'](arg);
          expect(result).to.equal(`[object Object].[object Object]`);
        });
      });
    });
  });
});
