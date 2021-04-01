'use strict';

// const { startInstallationContainer } = require('../docker');
const fs = require('fs-extra');
const log = require('../utils/log');
const path = require('path');
const { cyan, green } = require('colors');
const { getToolCachePath } = require('../utils/utils');

class Task {
  constructor(name, { cwd, env = {}, target, additionalArgs = [] } = {}) {
    this.name = name;
    this.cwd = cwd;
    this.env = env;
    this.target = target;
    this.additionalArgs = additionalArgs;
  }

  async run() {
    await this.beforeRun();
    await this.doRun();
    await this.afterRun();
  }

  async beforeRun() {
    if (this.target) {
      await fs.ensureDir(this.target);
    }
  }

  async afterRun() {

  }

  async doRun() {
    log.info(green('Task => ') + cyan('%s'), this.name ? this.name : '[UNNAMED]');
  }

  async _exec(cmd, cwd, env) {
    const command = require('../utils/command');

    await command.execCommand(cmd[0], cmd.slice(1), cwd, env ? env : this.env);
  }
}

class InstallTask extends Task {

  constructor(name, pkgName, context) {
    super(name, context);
    this.pkgName = pkgName;
  }
}

/**
 * install location: .fun/python/lib/python3.7/site-packages
 */
class PipTask extends InstallTask {
  constructor(pkgName, context) {
    super('PipTask', pkgName, context);
  }

  async doRun() {
    await super.doRun();

    const cmd = ['pip', 'install', '--user', '--upgrade', this.pkgName, ...this.additionalArgs];

    const pythonUserBase = path.join(this.target || path.join(this.cwd, getToolCachePath()), 'python');

    log.info(green('     => ') + cyan(`PYTHONUSERBASE=${pythonUserBase} ${cmd.join(' ')}`));

    await this._exec(cmd, this.cwd,
      Object.assign({
        'PIP_NO_WARN_SCRIPT_LOCATION': 0,
        'PIP_DISABLE_PIP_VERSION_CHECK': '1',
        'PYTHONUSERBASE': pythonUserBase
      }, this.env));
  }
}

class NpmTask extends InstallTask {
  constructor(pkgName, context) {
    super('NpmTask', pkgName, context);
  }

  async doRun() {
    await super.doRun();

    const cmd = ['npm', 'install', '-q', '--no-audit', '--production', this.pkgName, ...this.additionalArgs];

    log.info(green('     => ') + cyan(cmd.join(' ')));

    await this._exec(cmd, this.target || this.cwd);
  }
}

class AptTask extends InstallTask {

  constructor(pkgName, context) {
    const toolCachePath = getToolCachePath();

    super('AptTask', pkgName, context);
    this.cacheDir = path.join(this.cwd, toolCachePath, 'tmp', 'install');
    this.instDir = path.join(this.target || path.join(this.cwd, toolCachePath, 'root'));
  }

  async beforeRun() {
    await super.beforeRun();
    await this._exec(['bash', '-c', `mkdir -p ${this.cacheDir}`]);
  }

  async afterRun() {
    await this._exec(['bash', '-c', `sudo rm -rf ${this.cacheDir}`]);
    await this._exec(['sudo', 'chown', '-R', `${process.getuid()}:${process.getgid()}`, this.instDir]);
  }

  async doRun() {
    await super.doRun();

    await this.update();
    await this.dlPkg(this.pkgName);
    await this.instDeb();
    await this.cleanup();
  }

  async update() {
    console.log(green('     => ') + cyan('sudo apt-get update (if need)'));
    await this._exec(['bash', '-c',
      'if [ -z "$(find /var/cache/apt/pkgcache.bin -mmin -60 2>/dev/null)" ]; then sudo apt-get update; sudo touch /var/cache/apt/pkgcache.bin; fi']);
  }

  async dlPkg(pkgName) {
    log.info(green('     => ') + cyan('apt-get install -y -d -o=dir::cache=%s %s --reinstall --no-install-recommends'), this.cacheDir, pkgName);
    pkgName = Array.isArray(pkgName) ? pkgName : [pkgName];
    await this._exec(['sudo', 'apt-get', 'install', '-y', '-d', `-o=dir::cache=${this.cacheDir}`, ...pkgName, '--reinstall', '--no-install-recommends']);
  }

  async instDeb() {
    const prefix = this.target ? 'FUN_INSTALL_PREFIX=' + this.target + ' ' : '';

    console.log(green('     => ') + cyan(`bash -c
        for f in $(ls %s/archives/*.deb); do
          echo "Preparing to unpack \${f##*/}"
          dpkg -x $f %s;

          echo "Setting up \${f##*/}"
          mkdir -p %s/deb-control/\${f%.*};
          dpkg -e $f %s/deb-control/\${f%.*};
          if [ -f "%s/deb-control/\${f%.*}/postinst" ]; then
            ${prefix}FUN_INSTALL_LOCAL=true DPKG_MAINTSCRIPT_NAME=postinst %s/deb-control/\${f%.*}/postinst configure;
          fi;
        done;`), this.cacheDir, this.instDir, this.cacheDir, this.cacheDir, this.cacheDir, this.cacheDir);

    await this._exec(['bash', '-c', '-O', 'nullglob',
      `for f in ${this.cacheDir}/archives/*.deb; do
          echo "Preparing to unpack \${f##*/}"
          dpkg -x $f ${this.instDir};

          echo "Setting up \${f##*/}"
          mkdir -p ${this.cacheDir}/deb-control/\${f%.*};
          dpkg -e $f ${this.cacheDir}/deb-control/\${f%.*};
          if [ -f "${this.cacheDir}/deb-control/\${f%.*}/postinst" ]; then
            ${prefix}FUN_INSTALL_LOCAL=true DPKG_MAINTSCRIPT_NAME=postinst sudo ${this.cacheDir}/deb-control/\${f%.*}/postinst configure; 
          fi;
      done;`
    ]);
  }

  async cleanup() {
    log.info(green('     => ') + cyan('bash -c \'rm -rf %s/archives\''), this.cacheDir);
    await this._exec(['bash', '-c', `sudo rm -rf ${this.cacheDir}/archives`]);
  }
}

module.exports = {
  Task, InstallTask, PipTask, AptTask, NpmTask
};