'use strict';

const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const assert = sinon.assert;

const fs = require('fs-extra');
const path = require('path');

const proxyquire = require('proxyquire');

let PipInstallTask = require('../../../../lib/taskflows/python/pip/pip-install-task');
const cmd = require('../../../../lib/utils/command');

describe('test PipInstallTask', () => {
  const sourceDir = '/code';
  const artifactDir = '/artifacts';

  const file = {
    readLines: sandbox.stub()
  };

  beforeEach(async () => {

    PipInstallTask = proxyquire('../../../../lib/taskflows/python/pip/pip-install-task', {
      '../../../utils/file': file
    });

    sandbox.stub(cmd, 'execCommand').resolves({});
    sandbox.stub(fs, 'pathExists').resolves(true);
    sandbox.stub(fs, 'ensureDir').resolves(true);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('test PipInstallTask', async () => {

    file.readLines.resolves([]);

    const pipInstallTask = new PipInstallTask(sourceDir, artifactDir);

    await pipInstallTask.run();

    assert.calledWith(fs.pathExists, path.join(sourceDir, 'requirements.txt'));
    assert.calledWith(cmd.execCommand, 'pip', ['install', '--user', '-r', path.join(sourceDir, '/requirements.txt')]);
    assert.calledWith(fs.ensureDir, path.join(artifactDir, '.fun', 'python'));
  });
});
