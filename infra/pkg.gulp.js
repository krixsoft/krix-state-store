const gulp = require(`gulp`);
const replace = require('gulp-replace');
const { GulpHelper } = require(`./gulp.helper`);

const GulpCommon = require(`./common.gulp`);

module.exports = GulpHelper.combineGulpFiles(
  GulpCommon,
);
exports = module.exports;

const distFolder = `../dist`;

/**
 * Package Prepublish Logic
 */

exports[`pkg:update-main`] = function pkgUpdateMainInPackageJSON () {
  return gulp.src([
    `../package.json`,
  ])
    .pipe(replace(/\.\/dist\/index\.js/g, './index.js'))
    .pipe(replace(/\.\/dist\/index\.d\.ts/g, './index.d.ts'))
    .pipe(gulp.dest(`${distFolder}`));
};

exports[`pkg:copy-metafiles`] = function pkgCopyMetafiles () {
  return gulp.src([
    `../LICENSE.md`,
    `../README.md`,
  ])
    .pipe(gulp.dest(`${distFolder}`));
};

exports[`pkg:prepublish`] = gulp.series(
  exports[`pkg:update-main`],
  exports[`pkg:copy-metafiles`],
);

