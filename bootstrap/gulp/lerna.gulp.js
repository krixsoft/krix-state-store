/* eslint-disable @typescript-eslint/explicit-function-return-type */
const _ = require(`lodash`);
const gulp = require(`gulp`);
const gulpRun = require(`gulp-run`);

const { FSHelper } = require(`../helpers`);
const { Config } = require(`../config`);

const foldersOfPackages = FSHelper
  .getPathsOfFoldersByPath(Config.Paths.Packages);

const packageJsonOfPackages = _.map(foldersOfPackages, (folderOfPackage) => {
  return `${folderOfPackage}/package.json`;
});

exports[`lerna:bootstrap`] = function lernaBootstrap () {
  const runLernaBootstrapOutput = gulpRun(`npm run lerna:bootstrap`)
    .exec();
  return runLernaBootstrapOutput;
};

exports[`lerna:bootstrap:watch`] = function lernaBootstrapWatch () {
  return gulp.watch(
    packageJsonOfPackages,
    gulp.series(exports[`lerna:bootstrap`]),
  );
};

exports[`lerna:watch`] = gulp.series(
  exports[`lerna:bootstrap`],
  exports[`lerna:bootstrap:watch`],
);
