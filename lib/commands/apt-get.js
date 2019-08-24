'use strict';

const { installPackage } = require('../install/install');

async function install(packages, options) {
  await installPackage('apt', packages.join(' '), {
    codeUri: process.cwd()
  });
  
}

module.exports = install;
