'use strict';

// const { startInstallationContainer } = require('../docker');
const { cyan, green } = require('colors');
const path = require('path');

const log = require('../utils/log');

class Task {
  constructor(name, codeUri, env = {}) {
    this.name = name;
    this.codeUri = codeUri;
    this.env = env;
  }

  async run() {
    await this.beforeRun();
    await this.doRun();
    await this.afterRun();
  }

  async beforeRun() {

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

  constructor(name, codeUri, pkgName, env) {
    super(name, codeUri, env);
    this.pkgName = pkgName;
  }
}

/**
 * install location: .fun/python/lib/python3.7/site-packages
 */
class PipTask extends InstallTask {
  async doRun() {
    await super.doRun();

    let pythonUserBase = path.join(this.codeUri, '.fun', 'python');

    log.info(green('     => ') + cyan(`PYTHONUSERBASE=${pythonUserBase} pip install --user %s`), this.pkgName);

    await this._exec(['pip', 'install', '--user', this.pkgName], this.codeUri,
      Object.assign({
        'PIP_NO_WARN_SCRIPT_LOCATION': 0,
        'PIP_DISABLE_PIP_VERSION_CHECK': '1',
        'PYTHONUSERBASE': pythonUserBase
      }, this.env));
  }
}

class AptTask extends InstallTask {

  constructor(name, codeUri, pkgName, env) {
    super(name, codeUri, pkgName, env);
    this.cacheDir = path.join(codeUri, '.fun', 'tmp');
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
    const instDir = path.join(this.codeUri, '.fun', 'root');

    console.log(green('     => ') + cyan(`bash -c 
        for f in $(ls %s/archives/*.deb); do
          dpkg -x $f %s; 
          mkdir -p %s/deb-control/\${f%.*}; 
          dpkg -e $f %s/deb-control/\${f%.*}; 

          if [ -f "%s/deb-control/\${f%.*}/postinst" ]; then 
            FUN_INSTALL_LOCAL=true %s/deb-control/\${f%.*}/postinst configure;
          fi; 
        done;`), this.cacheDir, instDir, this.cacheDir, this.cacheDir, this.cacheDir, this.cacheDir);

    await this._exec(['bash', '-c', '-O', 'nullglob',
      `for f in ${this.cacheDir}/archives/*.deb; do 
          dpkg -x $f ${instDir}; 
          mkdir -p ${this.cacheDir}/deb-control/\${f%.*}; 
          dpkg -e $f ${this.cacheDir}/deb-control/\${f%.*}; 
          
          if [ -f "${this.cacheDir}/deb-control/\${f%.*}/postinst" ]; then 
            FUN_INSTALL_LOCAL=true ${this.cacheDir}/deb-control/\${f%.*}/postinst configure; 
          fi; 
      done;`
    ]);
  }

  async cleanup() {
    log.info(green('     => ') + cyan('bash -c \'rm -rf %s/archives\''), this.cacheDir);
    await this._exec(['bash', '-c', `rm -rf ${this.cacheDir}/archives`]);
  }
}

class ShellTask extends Task {
  constructor(name, codeUri, script, cwd = '', env) {
    super(name, codeUri, env);
    this.script = script;
    this.cwd = cwd;
  }

  async doRun() {
    await super.doRun();
    log.info(green('     => ') + cyan('bash -c  \'%s\''), this.script);
    if (this.cwd) {
      log.info(green('        ') + cyan('cwd: %s'), this.cwd);
    }

    await this._exec(['bash', '-c', this.script], this.cwd, this.env);
  }
}

module.exports = {
  Task, InstallTask, PipTask, AptTask, ShellTask
};