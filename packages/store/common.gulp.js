/* eslint-disable @typescript-eslint/explicit-function-return-type */
const gulp = require(`gulp`);
const eslint = require(`gulp-eslint`);
const del = require(`del`);
const mocha = require(`gulp-mocha`);

const sourceFolder = `./src`;
const distFolder = `./dist`;

exports[`clear:dist`] = async function clearDistTask () {
  const delResult = await del([ `${distFolder}/*`, `!${distFolder}/index.d.ts` ], { force: true });
  return delResult;
};

exports[`clear:test`] = async function clearTestTask () {
  const delResult = await del(`${distFolder}/**/*.spec.js`, { force: true });
  return delResult;
};

exports[`move:jts`] = function moveJTSTask () {
  return gulp.src([
    `${sourceFolder}/**/*.js`,
    `${sourceFolder}/**/*.d.ts`,
    `${sourceFolder}/**/*.json`,
  ])
    .pipe(gulp.dest(`${distFolder}`));
};

/**
 * ES Lint
 */

exports[`eslint`] = function eslintTask () {
  return gulp.src(`${sourceFolder}/**/*.ts`)
    .pipe(eslint())
    .pipe(eslint.format());
};

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
  exports[`test:start`],
  function testWatch () {
    return gulp.watch([
      `${distFolder}/**/*.js`,
    ], gulp.series(exports[`test:start`]));
  },
);
