const gulp = require(`gulp`);
const ts = require(`gulp-typescript`);
const eslint = require(`gulp-eslint`);
const mocha = require(`gulp-mocha`);
const del = require(`del`);

const sourceFolder = `./src`;
const startFile = `index.js`;
const distFolder = `./dist`;

gulp.task(`clean:dist`, async function () {
  const delResult = await del(`${distFolder}/*`, { force: true });
  return delResult;
});

/*
 * Start
 */

const spawn = require(`child_process`).spawn;
let node;

gulp.task(`start:prod`, function (done) {
  node = spawn(`node`, [`${distFolder}/${startFile}`], { stdio: `inherit` });
  done();
});

gulp.task(`start:dev`, function (done) {
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
});
process.on(`exit`, function () {
  // eslint-disable-next-line
  if (node) {
    node.kill();
  }
});

/**
 * ES Lint
 */

gulp.task(`eslint:prod`, function () {
  return gulp.src(`${sourceFolder}/**/*.ts`)
    .pipe(eslint())
    .pipe(eslint.format());
});
gulp.task(`eslint:dev`, function () {
  return gulp.src(`${sourceFolder}/**/*.ts`)
    .pipe(eslint())
    .pipe(eslint.format());
});

/**
 * TS Compilator
 */

const tsProject = ts.createProject(`./tsconfig.json`);

gulp.task(`build:move-jts`, gulp.series(function () {
  return gulp.src([
    `${sourceFolder}/**/*.js`,
    `${sourceFolder}/**/*.d.ts`,
    `${sourceFolder}/**/*.json`,
  ])
    .pipe(gulp.dest(`${distFolder}`));
}));

gulp.task(`build`, gulp.series(function () {
  return gulp.src(`${sourceFolder}/**/*.ts`)
    .pipe(tsProject())
    .pipe(gulp.dest(`${distFolder}`));
}, `build:move-jts`));

gulp.task(`build:prod`, gulp.series(`eslint:prod`, `clean:dist`, `build`));
gulp.task(`build:dev`, gulp.series(`eslint:dev`, `build`));

gulp.task(`watch`, gulp.series(
  `clean:dist`,
  `build:dev`,
  `start:dev`,
  function () {
    return gulp.watch([
      `${sourceFolder}/**/*.ts`,
      `${sourceFolder}/**/*.js`,
      `${sourceFolder}/**/*.json`,
    ], gulp.series(`build:dev`, `start:dev`));
  },
));

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
