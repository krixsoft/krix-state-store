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

  describe(`get`, () => {
    const defValue = 256;
    describe(`when method is invoked with null instead of object`, () => {
      it('should return undefined or default value', () => {
        const data: null = null;
        const dataFromObj = KrixHelper.get(data, '');
        expect(dataFromObj).to.be.undefined;
        const dataFromObjWithDef = KrixHelper.get(data, '', defValue);
        expect(dataFromObjWithDef).to.equal(defValue);
      });
    });
    describe(`when method is invoked with undefined instead of object`, () => {
      it('should return undefined or default value', () => {
        const data: undefined = undefined;
        const dataFromObj = KrixHelper.get(data, '');
        expect(dataFromObj).to.be.undefined;
        const dataFromObjWithDef = KrixHelper.get(data, '', defValue);
        expect(dataFromObjWithDef).to.equal(defValue);
      });
    });
    describe(`when method is invoked with string instead of object`, () => {
      it('should return undefined or default value', () => {
        const data: string = 'hello';
        const dataFromObj = KrixHelper.get(data, '');
        expect(dataFromObj).to.be.undefined;
        const dataFromObjWithDef = KrixHelper.get(data, '', defValue);
        expect(dataFromObjWithDef).to.equal(defValue);
      });
    });
    describe(`when method is invoked with number instead of object`, () => {
      it('should return undefined or default value', () => {
        const data: number = 4;
        const dataFromObj = KrixHelper.get(data, '');
        expect(dataFromObj).to.be.undefined;
        const dataFromObjWithDef = KrixHelper.get(data, '', defValue);
        expect(dataFromObjWithDef).to.equal(defValue);
      });
    });

    describe(`when method is invoked with object`, () => {
      describe(`and path is not string`, () => {
        it('should return undefined or default value', () => {
          const data = {
            hello: `World`,
          };
          const dataFromObjWithNumberPath = KrixHelper.get(data, <any>4);
          expect(dataFromObjWithNumberPath).to.be.undefined;
          const dataFromObjWithNumberPathWithDef = KrixHelper.get(data, <any>4, defValue);
          expect(dataFromObjWithNumberPathWithDef).to.equal(defValue);
          const dataFromObjWithObjectPath = KrixHelper.get(data, <any>{});
          expect(dataFromObjWithObjectPath).to.be.undefined;
          const dataFromObjWithObjectPathWithDef = KrixHelper.get(data, <any>{}, defValue);
          expect(dataFromObjWithObjectPathWithDef).to.equal(defValue);
          const dataFromObjWithUndefinedPath = KrixHelper.get(data, <any>undefined);
          expect(dataFromObjWithUndefinedPath).to.be.undefined;
          const dataFromObjWithUndefinedPathWithDef = KrixHelper.get(data, <any>undefined, defValue);
          expect(dataFromObjWithUndefinedPathWithDef).to.equal(defValue);
          const dataFromObjWithNullPath = KrixHelper.get(data, <any>null);
          expect(dataFromObjWithNullPath).to.be.undefined;
          const dataFromObjWithNullPathWithDef = KrixHelper.get(data, <any>null, defValue);
          expect(dataFromObjWithNullPathWithDef).to.equal(defValue);
        });
      });
      describe(`and path is empty string`, () => {
        it('should return undefined or default value', () => {
          const data = {
            hello: `World`,
          };
          const dataFromObj = KrixHelper.get(data, '');
          expect(dataFromObj).to.be.undefined;
          const dataFromObjWithDef = KrixHelper.get(data, '', defValue);
          expect(dataFromObjWithDef).to.equal(defValue);
        });
      });
      describe(`and path is a first level property`, () => {
        describe(`but property doesn't exist`, () => {
          it('should return undefined or default value', () => {
            const data = {
              hello: `World`,
            };
            const dataFromObj = KrixHelper.get(data, 'world');
            expect(dataFromObj).to.be.undefined;
            const dataFromObjWithDef = KrixHelper.get(data, 'world', defValue);
            expect(dataFromObjWithDef).to.equal(defValue);
          });
        });
        describe(`and property exists`, () => {
          it('should return value of property', () => {
            const data = {
              hello: `World`,
            };
            const dataFromObj = KrixHelper.get(data, 'hello');
            expect(dataFromObj).to.equal(data.hello);
          });
        });
      });
      describe(`and path is a second level property`, () => {
        describe(`and property exists`, () => {
          it('should return value of property', () => {
            const data = {
              hello: `World`,
              nestObj: { hello: `World 2` },
            };
            const dataFromObj = KrixHelper.get(data, 'nestObj.hello');
            expect(dataFromObj).to.equal(data.nestObj.hello);
          });
        });
      });
      describe(`and path is a third level property`, () => {
        describe(`and property exists`, () => {
          it('should return value of property', () => {
            const data = {
              hello: `World`,
              nestObj: {
                nestObj: { hello: `World 3` },
              },
            };
            const dataFromObj = KrixHelper.get(data, 'nestObj.nestObj.hello');
            expect(dataFromObj).to.equal(data.nestObj.nestObj.hello);
          });
        });
        describe(`but property by second part of path doesn't exist`, () => {
          it('should return or default value', () => {
            const data = {
              hello: `World`,
              nestObj: {
                nestObj: { hello: `World 3` },
              },
            };
            const dataFromObj = KrixHelper.get(data, 'nestObj.hello.hello');
            expect(dataFromObj).to.be.undefined;
            const dataFromObjWithDef = KrixHelper.get(data, 'nestObj.hello.hello', defValue);
            expect(dataFromObjWithDef).to.equal(defValue);
          });
        });
      });
    });
  });

});
