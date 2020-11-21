const gulp = require(`gulp`);
const ts = require(`gulp-typescript`);
const LinfraCore = require(`@linfra/core`);

const GulpCommon = require(`./common.gulp`);

module.exports = LinfraCore.Helpers.GulpHelper.combineGulpFiles(
  GulpCommon,
);
exports = module.exports;

const distFolder = `../dist`;

/**
 * TS Compilator
 */

const devTSConfig = ts.createProject(`../tsconfig.json`);

function buildTSForlder (sourceFolder) {
  return function buildTSTask () {
    console.log(`Build: ${sourceFolder}/**/*.ts`);
    return gulp.src(`${sourceFolder}/**/*.ts`)
      .pipe(devTSConfig())
      .on('error', () => { /* Ignore compiler errors */})
      .pipe(gulp.dest(`${distFolder}`));
  };
}

exports[`build:test`] = gulp.series(
  exports[`eslint`],
  exports[`clear:test`],
  buildTSForlder(`../src`),
  buildTSForlder(`../spec`),
  exports[`move:jts`],
);

exports[`build:pkg`] = gulp.series(
  exports[`eslint`],
  buildTSForlder(`../src`),
  exports[`move:jts`],
);
