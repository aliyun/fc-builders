'use strict';

const { installPackage } = require('../install/install');

async function install(packages, options) {
  await installPackage('npm', packages.join(' '), {
    cwd: process.cwd(),
    target: options.target,
    registryUrl: options.registry
  });
}

module.exports = install;
