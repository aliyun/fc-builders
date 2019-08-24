'use strict';

const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const assert = sinon.assert;

const fs = require('fs-extra');
const path = require('path');

const fileUtils = require('../../../lib/utils/file');
const CopyMavenArtifactsTask = require('../../../lib/taskflows/java/maven/copy-maven-artifacts-task');

describe('test CopyMavenArtifactsTask', () => {

  beforeEach(async () => {
    sandbox.stub(fileUtils, 'copySourceTo').resolves({});
    sandbox.stub(fs, 'pathExists').resolves(true);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('test CopyMavenArtifactsTask', async () => {

    const sourceDir = '/source';
    const targetDir = '/target';

    const copyMavenArtifactsTask = new CopyMavenArtifactsTask('/source', '/target');

    await copyMavenArtifactsTask.run();

    const classesDir = path.join(sourceDir, 'target', 'classes');
    const depenciesDir = path.join(sourceDir, 'target', 'dependency');

    assert.calledWith(fs.pathExists.firstCall, classesDir);
    assert.calledWith(fileUtils.copySourceTo.firstCall, classesDir, targetDir);
    assert.calledWith(fs.pathExists.secondCall, depenciesDir);
    assert.calledWith(fileUtils.copySourceTo.secondCall, depenciesDir, path.join(targetDir, 'lib'));
  });
});
