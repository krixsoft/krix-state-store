/* eslint-disable @typescript-eslint/explicit-function-return-type */
const _ = require(`lodash`);
const gulp = require(`gulp`);

const { FSHelper } = require(`../helpers`);
const { Config } = require(`../config`);

const SharedPath = `${Config.Paths.Shared}/**/*`;
const SharedPathWithDot = `${Config.Paths.Shared}/**/.*`;
const SharedPaths = [
  SharedPath,
  SharedPathWithDot,
];

exports[`shared:move`] = function sharedMove () {
  const sharedFilesStream = gulp.src(SharedPaths);

  const foldersOfPackages = FSHelper
    .getPathsOfFoldersByPath(Config.Paths.Packages);

  const destStream = _.reduce(
    foldersOfPackages,
    (chainStream, folderOfPackage) => {
      return chainStream.pipe(
        gulp.dest(folderOfPackage),
      );
    },
    sharedFilesStream,
  );

  return destStream;
};

exports[`shared:move:watch`] = function sharedMoveWatch () {
  return gulp.watch(SharedPaths, gulp.series(exports[`shared:move`]));
};

exports[`shared:watch`] = gulp.series(
  exports[`shared:move`],
  exports[`shared:move:watch`],
);
