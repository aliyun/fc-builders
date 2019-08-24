'use strict';

const { AptTask, PipTask, ShellTask } = require('./task');
const path = require('path');
const { FunModule } = require('./module');

async function installPackage(pkgType, pkgName, options) {
  switch (pkgType) {
    case 'apt':
      await new AptTask(options.name, options.codeUri,
        pkgName, options.local, options.env, options.verbose).run();
      break;
    case 'pip':
      await new PipTask(options.name, options.codeUri,
        pkgName, options.local, options.env, options.verbose).run();
      break;
    default:
      throw new Error(`unknow package type %${options.packageType}`);
  }
}

async function installFromYaml(file) {

  const funModule = FunModule.load(file);
  const codeUri = path.dirname(file);

  for (const t of funModule.tasks) {
    if (t.type === 'pip') {
      const pipTask = new PipTask(t.attrs.name, codeUri,
        t.attrs.pip, t.attrs.local, t.attrs.env);
      await pipTask.run();
    } else if (t.type === 'apt') {
      const aptTask = new AptTask(t.attrs.name, codeUri,
        t.attrs.apt, t.attrs.local, t.attrs.env);
      await aptTask.run();
    } else if (t.type === 'shell') {
      const shellTask = new ShellTask(t.attrs.name, codeUri,
        t.attrs.shell, t.attrs.cwd, t.attrs.env);
      await shellTask.run();
    } else {
      console.error('unkown task %s', t);
    }
  }
}

module.exports = {
  installFromYaml,
  installPackage
};