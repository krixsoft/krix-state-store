/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
// import * as sinon from 'sinon';

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
});
