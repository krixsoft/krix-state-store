
class GulpHelper {
  static combineGulpFiles (...gulpFiles) {
    const gulpModule = gulpFiles.reduce((partOfGulpModule, gulpFile) => {
      return {
        ...partOfGulpModule,
        ...gulpFile,
      };
    }, {});

    return gulpModule;
  }
}

module.exports.GulpHelper= GulpHelper;
