'use strict';

const { AptTask, PipTask, NpmTask } = require('./task');
const log = require('../utils/log');
const fs = require('fs-extra');
const httpx = require('httpx');
const path = require('path');

class PackageSolution {
  constructor(pkgName, context) {
    this.pkgName = pkgName;
    this.context = context;
    this.prepareTasks = [];
    this.tasks = [];

    this.init();
  }

  init() { }

  async prepare() {
    for (const task of this.prepareTasks) {
      await task.run();
    }
  }

  async doInstall() {
    for (const task of this.tasks) {
      await task.run();
    }
  }

  async install() {
    await this.prepare();
    await this.doInstall();
  }

  static getPkgType() { }
  static getName() { }
}

const DEFAULT_NPM_MIRROR = 'https://registry.npmjs.com';
const TAOBAO_NPM_MIRROR = 'https://registry.npm.taobao.org';
// https://github.com/cnpm/cnpmjs.org/issues/1246
const TAOBAO_PUPPETEER_MIRROR = 'https://npm.taobao.org/mirrors';

class NpmPuppeteerSolution extends PackageSolution {
  constructor(context) {
    super('puppeteer', context);
  }

  static getPkgType() {
    return 'npm';
  }

  static getName() {
    return 'NpmPuppeteerSolution';
  }

  static getPkgName() {
    return 'puppeteer';
  }

  async _optimizeNpmrcConfig() {
    const npmrcPath = path.join(this.context.target || this.context.cwd, '.npmrc');

    let npmrcContent = '';
    if (await fs.pathExists(npmrcPath)) {
      npmrcContent = await fs.readFile(npmrcPath, 'utf8');
    }

    let useTaobaoMirror = false;

    const promises = [DEFAULT_NPM_MIRROR, TAOBAO_NPM_MIRROR].map(r => httpx.request(r, { timeout: 3000 }).then(() => r));

    try {
      const registry = await Promise.race(promises);

      log.debug('registry used', registry);

      if (registry === TAOBAO_NPM_MIRROR) {
        useTaobaoMirror = true;
      }
    } catch (error) {
      useTaobaoMirror = false;
      log.error(error);
    }

    if (npmrcContent.indexOf('puppeteer_download_host') === -1 && useTaobaoMirror) {
      const config = `puppeteer_download_host = "${TAOBAO_PUPPETEER_MIRROR}"`;
      log.info(`append config '${config}' to .npmrc in order to speed up chromium download process`);
      fs.appendFile(npmrcPath, config + '\n');
    }

    if (npmrcContent.indexOf('registry') === -1 && useTaobaoMirror) {
      const config = `registry = "${TAOBAO_NPM_MIRROR}"`;
      log.info(`append config '${config}' to .npmrc in order to speed up npm packages download process`);

      fs.appendFile(npmrcPath, config + '\n');
    }
  }

  init() {
    this.prepareTasks.push(
      new AptTask('libxtst6', this.context),
      new AptTask('libnss3', this.context),
      new AptTask('libxss1', this.context),
      new AptTask('libasound2', this.context),
      new AptTask('libatk-bridge2.0-0', this.context),
      new AptTask('libgtk-3-0', this.context));

    this.tasks.push(new NpmTask('puppeteer', this.context));
  }

  async prepare() {
    await super.prepare();

    await this._optimizeNpmrcConfig();
  }
}

class NpmDefaultSolution extends PackageSolution {
  constructor(pkgName, context) {
    super(pkgName, context);
  }

  init() {
    this.tasks.push(new NpmTask(this.pkgName, this.context));
  }

  static getName() {
    return 'NpmDefaultSolution';
  }

  static getPkgType() {
    return 'npm';
  }
}
class AptImagemagickSolution extends PackageSolution {
  constructor(context) {
    super('imagemagick', context);
  }

  static getPkgType() {
    return 'apt';
  }

  static getName() {
    return 'AptImagemagickSolution';
  }

  static getPkgName() {
    return 'imagemagick';
  }

  init() {
    this.prepareTasks.push(
      new AptTask('imagemagick-6.q16', this.context)
    );
    this.tasks.push(new AptTask('imagemagick', this.context));
  }
}

class AptDefaultSolution extends PackageSolution {
  constructor(pkgName, context) {
    super(pkgName, context);
  }

  init() {
    this.tasks.push(new AptTask(this.pkgName, this.context));
  }

  static getPkgType() {
    return 'apt';
  }

  static getName() {
    return 'AptDefaultSolution';
  }
}

class PipDefaultSolution extends PackageSolution {
  constructor(pkgName, context) {
    super(pkgName, context);
  }

  init() {
    this.tasks.push(new PipTask(this.pkgName, this.context));
  }

  static getPkgType() {
    return 'pip';
  }

  static getName() {
    return 'PipDefaultSolution';
  }
}

const solutions = [NpmPuppeteerSolution, AptImagemagickSolution];
const defaultSolutions = [AptDefaultSolution, NpmDefaultSolution, PipDefaultSolution];

const enhancedPackageSolutionFacory = (pkgType, pkgName, context) => {
  for (const solution of solutions) {
    if (solution.getPkgType() === pkgType && solution.getPkgName() === pkgName) {
      log.debug('selected solution is: ', solution.getName());
      return new solution(context);
    }
  }

  return null;
};

const defaultPackageSolutionFactory = (pkgType, pkgName, context) => {
  for (const defaultSolution of defaultSolutions) {
    if (defaultSolution.getPkgType() === pkgType) {
      return new defaultSolution(pkgName, context);
    }
  }

  return null;
};

const packageSolutionFactory = (pkgType, pkgName, context) => {
  const solution = enhancedPackageSolutionFacory(pkgType, pkgName, context)
    || defaultPackageSolutionFactory(pkgType, pkgName, context);

  if (solution) { return solution; }
  throw new Error(`unknow package type ${pkgType}`);
};

module.exports = { packageSolutionFactory, enhancedPackageSolutionFacory };