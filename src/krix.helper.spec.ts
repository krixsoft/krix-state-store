/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

import { KrixHelper } from './krix.helper';

describe(`KrixHelper`, () => {
  describe(`cloneDeep`, () => {
    describe(`when method is invoked with null`, () => {
      it('should return null', () => {
        const data: null = null;
        const clonedData = KrixHelper.cloneDeep(data);
        expect(clonedData).to.be.null;
      });
    });
    describe(`when method is invoked with undefined`, () => {
      it('should return undefined', () => {
        const data: undefined = undefined;
        const clonedData = KrixHelper.cloneDeep(data);
        expect(clonedData).to.be.undefined;
      });
    });
    describe(`when method is invoked with string`, () => {
      it('should return copy of string', () => {
        const data: string = 'hello';
        const clonedData = KrixHelper.cloneDeep(data);
        expect(clonedData).to.equal(data);
      });
    });
    describe(`when method is invoked with number`, () => {
      it('should return copy of number', () => {
        const data: number = 4;
        const clonedData = KrixHelper.cloneDeep(data);
        expect(clonedData).to.equal(data);
      });
    });
    describe(`when method is invoked with object`, () => {
      it('should return copy of object', () => {
        const data = {
          hello: `World`,
        };
        const clonedData = KrixHelper.cloneDeep(data);
        expect(clonedData).to.not.equal(data);
        expect(clonedData.hello).to.equal(data.hello);
      });
    });
    describe(`when method is invoked with object with nested object`, () => {
      it('should return copy of object with copy of nested object', () => {
        const data = {
          hello: `World`,
          nestObj: { hello: `No` },
        };
        const clonedData = KrixHelper.cloneDeep(data);
        expect(clonedData).to.not.equal(data);
        expect(clonedData.hello).to.equal(data.hello);
        expect(clonedData.nestObj).to.not.equal(data.nestObj);
        expect(clonedData.nestObj.hello).to.equal(data.nestObj.hello);
      });
    });
  });

});
