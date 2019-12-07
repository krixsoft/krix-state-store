const _ = require('lodash');

class GulpHelper {
  static combineGulpFiles (...gulpFiles) {
    const gulpModule = _.reduce(gulpFiles, (partOfGulpModule, gulpFile) => {
      return {
        ...partOfGulpModule,
        ...gulpFile,
      };
    }, {});

    return gulpModule;
  }
}

exports.GulpHelper = GulpHelper;
