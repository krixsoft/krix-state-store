const gulp = require(`gulp`);
const { GulpHelper } = require(`./gulp.helper`);

const GulpCommon = require(`./common.gulp`);
const GulpBuild = require(`./build.gulp`);

module.exports = GulpHelper.combineGulpFiles(
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
