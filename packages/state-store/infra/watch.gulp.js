const gulp = require(`gulp`);
const LinfraCore = require(`@linfra/core`);

const GulpCommon = require(`./common.gulp`);
const GulpBuild = require(`./build.gulp`);

module.exports = LinfraCore.Helpers.GulpHelper.combineGulpFiles(
  GulpCommon,
  GulpBuild,
);
exports = module.exports;

const sourceFolder = `../src`;

/**
 * TS Compilator
 */

exports[`dev:watch`] = gulp.series(
  function watchPkgTask () {
    return gulp.watch([
      `${sourceFolder}/**/*.ts`,
      `${sourceFolder}/**/*.js`,
      `${sourceFolder}/**/*.json`,
    ], gulp.series(exports[`build:pkg`]));
  },
);
