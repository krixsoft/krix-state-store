const gulp = require(`gulp`);
const ts = require(`gulp-typescript`);
const tslint = require("gulp-tslint");
const mocha = require('gulp-mocha');
const del = require("del");

const sourceFolder = `./src`;
const startFile = `index.js`;
const distFolder = `./dist`;

gulp.task(`clean:dist`, function () {
  return del(`${distFolder}/*`, { force: true });
});

/*
 * Start
 */

const spawn = require(`child_process`).spawn;
let node;

gulp.task(`start:prod`, function(done) {
  node = spawn(`node`, [`${distFolder}/${startFile}`], {stdio: `inherit`});
	done();
});

gulp.task(`start:dev`, function(done) {
  if (node) node.kill();
  node = spawn(`node`, [`${distFolder}/${startFile}`], {stdio: `inherit`});
  node.on(`close`, function (code) {
    if (code === 8) {
      gulp.log(`Error detected, waiting for changes...`);
    }
  });
	done();
});
process.on(`exit`, function() {
  if (node) node.kill();
});

/**
 * TS Lint
 */

const lintConfig = {
  configuration: "./tslint.json",
  formatter: "verbose",
};
const lintReportConfig = {
  emitError: false,
  summarizeFailureOutput: true,
  reportLimit: 10,
};

gulp.task(`tslint:prod`, function () {
  return gulp.src(`${sourceFolder}/**/*.ts`)
    .pipe(tslint(lintConfig))
    .pipe(tslint.report({
      ...lintReportConfig,
      emitError: true,
    }));
});
gulp.task(`tslint:dev`, function () {
  return gulp.src(`${sourceFolder}/**/*.ts`)
    .pipe(tslint(lintConfig))
    .pipe(tslint.report(lintReportConfig));
});

/**
 * TS Compilator
 */

const tsProject = ts.createProject(`./tsconfig.json`);

gulp.task(`build:move-jts`, gulp.series(function () {
  return gulp.src([ `${sourceFolder}/**/*.js`, `${sourceFolder}/**/*.d.ts`, `${sourceFolder}/**/*.json` ])
    .pipe(gulp.dest(`${distFolder}`));
}));

gulp.task(`build`, gulp.series(function () {
  return gulp.src(`${sourceFolder}/**/*.ts`)
    .pipe(tsProject())
    .pipe(gulp.dest(`${distFolder}`));
}, `build:move-jts`));

gulp.task(`build:prod`, gulp.series(`tslint:prod`, `clean:dist`, `build`));
gulp.task(`build:dev`, gulp.series(`tslint:dev`, `build`));

gulp.task(`watch`, gulp.series(`clean:dist`, `build:dev`, `start:dev`, function () {
  return gulp.watch([
    `${sourceFolder}/**/*.ts`,
    `${sourceFolder}/**/*.js`,
    `${sourceFolder}/**/*.json`,
  ], gulp.series(`build:dev`, `start:dev`));
}));

/**
 * Tests
 */

gulp.task(`test`, gulp.series(function () {
  return gulp.src(`${distFolder}/**/*.spec.js`)
    .pipe(mocha({ reporter: 'spec', exit: true }))
    .once('error', (error) => {
        console.error(error);
    });
}));

gulp.task(`watch:test`, gulp.series(`test`, function () {
  return gulp.watch([
    `${distFolder}/**/*.spec.js`,
  ], gulp.series(`test`));
}));
