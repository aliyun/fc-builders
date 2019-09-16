'use strict';

// const { startInstallationContainer } = require('../docker');
const { cyan, green } = require('colors');
const path = require('path');
const fs = require('fs-extra');

const log = require('../utils/log');

class Task {
  constructor(name, cwd, env = {}, target) {
    this.name = name;
    this.cwd = cwd;
    this.env = env;
    this.target = target;
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

    log.debug('cmd is: ' + JSON.stringify(cmd));

    await command.execCommand(cmd[0], cmd.slice(1), cwd, env ? env : this.env);
  }
}

class InstallTask extends Task {

  constructor(name, cwd, pkgName, env, target) {
    super(name, cwd, env, target);
    this.pkgName = pkgName;
  }
}

/**
 * install location: .fun/python/lib/python3.7/site-packages
 */
class PipTask extends InstallTask {
  async doRun() {
    await super.doRun();

    let pythonUserBase = path.join(this.target || path.join(this.cwd, '.fun'), 'python');

    log.info(green('     => ') + cyan(`PYTHONUSERBASE=${pythonUserBase} pip install --user %s`), this.pkgName);

    await this._exec(['pip', 'install', '--user', this.pkgName], this.cwd,
      Object.assign({
        'PIP_NO_WARN_SCRIPT_LOCATION': 0,
        'PIP_DISABLE_PIP_VERSION_CHECK': '1',
        'PYTHONUSERBASE': pythonUserBase
      }, this.env));
  }
}

class AptTask extends InstallTask {

  constructor(name, cwd, pkgName, env, target) {
    super(name, cwd, pkgName, env, target);
    this.cacheDir = path.join(cwd, '.fun', 'tmp', 'install');
  }

  async beforeRun() {
    await super.beforeRun();
    await this._exec(['bash', '-c', `mkdir -p ${this.cacheDir}`]);
  }

  async afterRun() {
    await this._exec(['bash', '-c', `rm -rf ${this.cacheDir}`]);
  }

  async doRun() {
    await super.doRun();

    await this.update();
    await this.dlPkg(this.pkgName);
    await this.instDeb();
    await this.cleanup();
  }

  async update() {
    console.log(green('     => ') + cyan('apt-get update (if need)'));
    await this._exec(['bash', '-c',
      'if [ -z "$(find /var/cache/apt/pkgcache.bin -mmin -60 2>/dev/null)" ]; then apt-get update; touch /var/cache/apt/pkgcache.bin; fi']);
  }
  
  async dlPkg(pkgName) {
    log.info(green('     => ') + cyan('apt-get install -y -d -o=dir::cache=%s %s --reinstall'), this.cacheDir, pkgName);

    await this._exec(['apt-get', 'install', '-y', '-d', `-o=dir::cache=${this.cacheDir}`, pkgName, '--reinstall']);
  }

  async instDeb() {
    const instDir = path.join(this.target || path.join(this.cwd, '.fun', 'root'));

    const prefix = this.target ? 'FUN_INSTALL_PREFIX=' + this.target + ' ' : '';

    console.log(green('     => ') + cyan(`bash -c 
        for f in $(ls %s/archives/*.deb); do
          dpkg -x $f %s; 
          mkdir -p %s/deb-control/\${f%.*}; 
          dpkg -e $f %s/deb-control/\${f%.*}; 

          if [ -f "%s/deb-control/\${f%.*}/postinst" ]; then 
            ${prefix}FUN_INSTALL_LOCAL=true %s/deb-control/\${f%.*}/postinst configure;
          fi; 
        done;`), this.cacheDir, instDir, this.cacheDir, this.cacheDir, this.cacheDir, this.cacheDir);

    await this._exec(['bash', '-c', '-O', 'nullglob',
      `for f in ${this.cacheDir}/archives/*.deb; do 
          dpkg -x $f ${instDir}; 
          mkdir -p ${this.cacheDir}/deb-control/\${f%.*}; 
          dpkg -e $f ${this.cacheDir}/deb-control/\${f%.*}; 
          
          if [ -f "${this.cacheDir}/deb-control/\${f%.*}/postinst" ]; then 
            ${prefix}FUN_INSTALL_LOCAL=true ${this.cacheDir}/deb-control/\${f%.*}/postinst configure; 
          fi; 
      done;`
    ]);
  }

  async cleanup() {
    log.info(green('     => ') + cyan('bash -c \'rm -rf %s/archives\''), this.cacheDir);
    await this._exec(['bash', '-c', `rm -rf ${this.cacheDir}/archives`]);
  }
}

module.exports = {
  Task, InstallTask, PipTask, AptTask
};