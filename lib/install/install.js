'use strict';

const { packageSolutionFactory } = require('./solutions');

async function installPackage(pkgType, pkgName, options) {
  const solution = packageSolutionFactory(pkgType, pkgName, options.cwd, options.env, options.target);
  await solution.install();
}

module.exports = {
  installPackage
};