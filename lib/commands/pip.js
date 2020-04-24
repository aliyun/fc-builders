'use strict';

const { installPackage } = require('../install/install');

async function install(packages, options) {

  const additionalArgs = [];

  if (options.indexUrl) {
    additionalArgs.push('-i', options.indexUrl);
  }

  await installPackage('pip', packages.join(' '), {
    cwd: process.cwd(),
    target: options.target,
    additionalArgs
  });
}

module.exports = install;
