'use strict';

const { packageSolutionFactory } = require('./solutions');

async function installPackage(pkgType, pkgName, options) {
  const solution = packageSolutionFactory(pkgType, pkgName, options);
  await solution.install();
}

module.exports = {
  installPackage
};