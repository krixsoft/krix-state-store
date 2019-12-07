const { GulpHelper } = require('./bootstrap/helpers');

const BootstrapGulp = require(`./bootstrap/gulp`);

module.exports = GulpHelper.combineGulpFiles(
  BootstrapGulp,
);
