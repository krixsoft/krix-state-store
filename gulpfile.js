/* eslint-disable @typescript-eslint/explicit-function-return-type */
const gulp = require(`gulp`);
const ts = require(`gulp-typescript`);
const eslint = require(`gulp-eslint`);
const mocha = require(`gulp-mocha`);
const del = require(`del`);

const sourceFolder = `./src`;
const startFile = `index.js`;
const distFolder = `./dist`;

exports[`clean:dist`] = async function cleanDist () {
  const delResult = await del(`${distFolder}/*`, { force: true });
  return delResult;
};

/*
 * Start
 */

const spawn = require(`child_process`).spawn;
let node;

exports[`start:prod`] = function startProd (done) {
  node = spawn(`node`, [`${distFolder}/${startFile}`], { stdio: `inherit` });
  done();
};

exports[`start:dev`] = function startDev (done) {
  // eslint-disable-next-line
  if (node) {
    node.kill();
  }
  node = spawn(`node`, [`${distFolder}/${startFile}`], { stdio: `inherit` });
  node.on(`close`, function (code) {
    if (code === 8) {
      gulp.log(`Error detected, waiting for changes...`);
    }
  });
  done();
};

process.on(`exit`, function () {
  // eslint-disable-next-line
  if (node) {
    node.kill();
  }
});


/**
 * ES Lint
 */

exports[`eslint:prod`] = function eslintProd () {
  return gulp.src(`${sourceFolder}/**/*.ts`)
    .pipe(eslint())
    .pipe(eslint.format());
};
exports[`eslint:dev`] = function eslintDev () {
  return gulp.src(`${sourceFolder}/**/*.ts`)
    .pipe(eslint())
    .pipe(eslint.format());
};

/**
 * TS Compilator
 */

const tsProject = ts.createProject(`./tsconfig.json`);

exports[`move-jts`] = function moveJTS () {
  return gulp.src([
    `${sourceFolder}/**/*.js`,
    `${sourceFolder}/**/*.d.ts`,
    `${sourceFolder}/**/*.json`,
  ])
    .pipe(gulp.dest(`${distFolder}`));
};

exports[`build:ts`] = function buildTs () {
  return gulp.src(`${sourceFolder}/**/*.ts`)
    .pipe(tsProject())
    .pipe(gulp.dest(`${distFolder}`));
};

exports[`build`] = gulp.series(exports[`build:ts`], exports[`move-jts`]);

exports[`build:prod`] = gulp.series(
  exports[`eslint:prod`],
  exports[`clean:dist`],
  exports[`build`],
);
exports[`build:dev`] = gulp.series(exports[`eslint:dev`], exports[`build`]);

exports[`watch:build:project`] = function watchBuildProject () {
  return gulp.watch([
    `${sourceFolder}/**/*.ts`,
    `${sourceFolder}/**/*.js`,
    `${sourceFolder}/**/*.json`,
  ], gulp.series(exports[`build:dev`], exports[`start:dev`]));
};

exports[`watch`] = gulp.series(
  exports[`clean:dist`] ,
  exports[`build:dev`],
  exports[`start:dev`],
  exports[`watch:build:project`],
);

/**
 * Tests
 */

exports[`test`] = function test () {
  return gulp.src(`${distFolder}/**/*.spec.js`)
    .pipe(mocha({ reporter: 'spec', exit: true }))
    .once('error', (error) => {
      console.error(error);
    });
};

exports[`watch:build:test`] = function watchBuildTest () {
  return gulp.watch([
    `${distFolder}/**/*.spec.js`,
  ], gulp.series(exports[`test`]));
};

exports[`watch:test`] = gulp.series(
  exports[`test`],
  exports[`watch:build:test`],
);
