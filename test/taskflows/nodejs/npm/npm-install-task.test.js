'use strict';

const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const assert = sinon.assert;

const fs = require('fs-extra');
const path = require('path');

const NpmInstallTask = require('../../../../lib/taskflows/nodejs/npm/npm-install-task');
const cmd = require('../../../../lib/utils/command');

describe('test NpmInstallTask', () => {
  const artifactDir = '/artifactDir';

  beforeEach(async () => {
    sandbox.stub(cmd, 'execCommand').resolves({});
    sandbox.stub(fs, 'pathExists').resolves(true);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('test NpmInstallTask', async () => {

    const npmInstallTask = new NpmInstallTask(artifactDir);

    sandbox.replace(npmInstallTask, 'hasYarnLock', () => false);

    await npmInstallTask.run();

    assert.calledWith(fs.pathExists, path.join(artifactDir, 'package.json'));
    assert.calledWith(cmd.execCommand, 'npm', ['install', '-q', '--no-audit', '--no-save'], path.resolve(artifactDir));
  });

  it('test NpmInstallTask with yarn.lock', async () => {

    const npmInstallTask = new NpmInstallTask(artifactDir);

    sandbox.replace(npmInstallTask, 'hasYarnLock', () => true);

    await npmInstallTask.run();

    assert.calledWith(fs.pathExists, path.join(artifactDir, 'package.json'));
    assert.calledWith(cmd.execCommand, 'yarn', ['install', '--silent', '--pure-lockfile'], path.resolve(artifactDir));
  });
});
