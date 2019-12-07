/* eslint-disable @typescript-eslint/explicit-function-return-type */
const { readdirSync, statSync } = require(`fs`);
const { join } = require(`path`);

class FSHelper {
  static isDirectory (path) {
    return statSync(path).isDirectory();
  }

  static isFile (path) {
    return statSync(path).isFile();
  }

  static getFileNameByPath (path) {
    const matchFileName = path.match(/([^\/]*)\/*$/);
    const fileName = Array.isArray(matchFileName)
      ? matchFileName[1]
      : '';
    return fileName;
  }

  static getNamesOfFoldersByPath (dir) {
    return readdirSync(dir).filter((file) => {
      const filePath = join(dir, file);
      return FSHelper.isDirectory(filePath);
    });
  }

  static getPathsOfFoldersByPath (base) {
    return FSHelper.getNamesOfFoldersByPath(base).map((path) => {
      const folderPath = `${base}/${path}`;
      return folderPath;
    });
  }

  static getNamesOfFilesByPath (dir) {
    return readdirSync(dir).filter((file) => {
      const filePath = join(dir, file);
      return FSHelper.isFile(filePath);
    });
  }

  static getPathsOfFilesByPath (base) {
    return FSHelper.getNamesOfFilesByPath(base).map((path) => {
      const filePath = `${base}/${path}`;
      return filePath;
    });
  }

  static getNamesOfAllByPath (dir) {
    return readdirSync(dir).filter((file) => {
      const filePath = join(dir, file);
      return FSHelper.isFile(filePath) || FSHelper.isDirectory(filePath);
    });
  }

  static getPathsOfAllByPath (base) {
    return FSHelper.getNamesOfAllByPath(base).map((path) => {
      const filePath = `${base}/${path}`;
      return filePath;
    });
  }
}

exports.FSHelper = FSHelper;
