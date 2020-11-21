const gulp = require(`gulp`);
const mocha = require(`gulp-mocha`);
const LinfraCore = require(`@linfra/core`);

const GulpBuild = require(`./build.gulp`);

module.exports = LinfraCore.Helpers.GulpHelper.combineGulpFiles(
  GulpBuild,
);
exports = module.exports;

const distFolder = `../dist`;
const specFolder = `../spec`;

/**
 * Tests
 */

exports[`test:start`] = function test () {
  return gulp.src(`${distFolder}/**/*.spec.js`)
    .pipe(mocha({ reporter: 'spec', exit: true }))
    .once('error', (error) => {
      console.error(error);
    });
};

exports[`test:watch`] = gulp.series(
  exports[`build:test`],
  exports[`test:start`],
  gulp.parallel(
    function testBuildWatch () {
      return gulp.watch([
        `${specFolder}/**/*.ts`,
      ], gulp.series(exports[`build:test`]));
    },
    function testStartWatch () {
      return gulp.watch([
        `${distFolder}/**/*.js`,
      ], gulp.series(exports[`test:start`]));
    },
  ),
);
