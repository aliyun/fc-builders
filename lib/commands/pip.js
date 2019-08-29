'use strict';

const { installPackage } = require('../install/install');

async function install(packages, options) {
  await installPackage('pip', packages.join(' '), {
    cwd: process.cwd(),
    target: options.target
  });
}

module.exports = install;
