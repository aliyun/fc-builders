'use strict';

const { AptTask, PipTask } = require('./task');

async function installPackage(pkgType, pkgName, options) {
  switch (pkgType) {
  case 'apt':
    await new AptTask(options.name, options.cwd,
      pkgName, options.env, options.target).run();
    break;
  case 'pip':
    await new PipTask(options.name, options.cwd,
      pkgName, options.env, options.target).run();
    break;
  default:
    throw new Error(`unknow package type %${options.packageType}`);
  }
}


module.exports = {
  installPackage
};