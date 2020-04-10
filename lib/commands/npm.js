'use strict';

const { installPackage } = require('../install/install');

async function install(packages, options) {

  const additionalArgs = [];

  if (options.registry) {
    additionalArgs.push('--registry', options.registry);
  }

  await installPackage('npm', packages.join(' '), {
    cwd: process.cwd(),
    target: options.target,
    additionalArgs
  });
}

module.exports = install;
