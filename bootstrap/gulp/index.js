const { GulpHelper } = require('../helpers');

const SharedGulp = require('./shared.gulp');
const LernaGulp = require('./lerna.gulp');

module.exports = GulpHelper.combineGulpFiles(
  SharedGulp,
  LernaGulp,
);
