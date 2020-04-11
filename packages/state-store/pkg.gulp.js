/* eslint-disable @typescript-eslint/explicit-function-return-type */
const gulp = require(`gulp`);
const ts = require(`gulp-typescript`);
const replace = require('gulp-replace');
const LinfraCore = require(`@linfra/core`);

const GulpCommon = require(`./common.gulp`);

module.exports = LinfraCore.Helpers.GulpHelper.combineGulpFiles(
  GulpCommon,
);
exports = module.exports;

const distFolder = `./dist`;

/**
 * Package Prepublish Logic
 */

exports[`pkg:update-main`] = function pkgUpdateMainInPackageJSON () {
  return gulp.src([
    `./package.json`,
  ])
    .pipe(replace(/\.\/dist\/index\.js/g, './index.js'))
    .pipe(gulp.dest(`${distFolder}`));
};

exports[`pkg:copy-metafiles`] = function pkgCopyMetafiles () {
  return gulp.src([
    `./LICENSE.md`,
  ])
    .pipe(gulp.dest(`${distFolder}`));
};

exports[`pkg:prepublish`] = gulp.series(
  exports[`pkg:update-main`],
  exports[`pkg:copy-metafiles`],
);

