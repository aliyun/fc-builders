'use strict';

const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const assert = sinon.assert;

const fs = require('fs-extra');
const path = require('path');

const ComposerInstallTask = require('../../../../lib/taskflows/php/composer/composer-install-task');
const cmd = require('../../../../lib/utils/command');

describe('test ComposerInstallTask', () => {
  const artifactDir = '/artifactDir';

  beforeEach(async () => {
    sandbox.stub(cmd, 'execCommand').resolves({});
    sandbox.stub(fs, 'pathExists').resolves(true);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('test ComposerInstallTask', async () => {

    const composerInstallTask = new ComposerInstallTask(artifactDir);

    await composerInstallTask.run();

    assert.calledWith(fs.pathExists, path.join(artifactDir, 'composer.json'));
    assert.calledWith(cmd.execCommand, 'composer', ['install', '--no-dev', '--no-interaction', '--prefer-dist'], artifactDir);
  });
});
