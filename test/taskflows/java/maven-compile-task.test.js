'use strict';

const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const assert = sinon.assert;

const fs = require('fs-extra');
const path = require('path');

const MavenCompileTask = require('../../../lib/taskflows/java/maven/maven-compile-task');
const cmd = require('../../../lib/utils/command');

describe('test MavenCompileTask', () => {
  const artifactDir = '/artifactDir';

  beforeEach(async () => {
    sandbox.stub(cmd, 'execCommand').resolves({});
    sandbox.stub(fs, 'pathExists').resolves(true);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('test MavenCompileTask', async () => {

    const mavenCompileTask = new MavenCompileTask(artifactDir);

    await mavenCompileTask.run();

    assert.calledWith(fs.pathExists, path.join(artifactDir, 'pom.xml'));
    assert.calledWith(cmd.execCommand, 'mvn', ['clean', 'compile'], artifactDir);
  });
});
