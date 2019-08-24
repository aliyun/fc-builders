'use strict';

const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const assert = sinon.assert;

const fs = require('fs-extra');
const path = require('path');

const MavenCopyDependenciesTask = require('../../../lib/taskflows/java/maven/maven-copy-dependencies-task');
const cmd = require('../../../lib/utils/command');

describe('test MavenTaskFlow', () => {
  const buildDir = '/buildDir';

  beforeEach(async () => {
    sandbox.stub(cmd, 'execCommand').resolves({});
    sandbox.stub(fs, 'pathExists').resolves(true);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('test MavenTaskFlow', async () => {

    const mavenCopyDependenciesTask = new MavenCopyDependenciesTask(buildDir);

    await mavenCopyDependenciesTask.start();

    assert.calledWith(fs.pathExists, path.join(buildDir, 'pom.xml'));
    assert.calledWith(cmd.execCommand, 'mvn', ['dependency:copy-dependencies', '-DincludeScope=compile'], buildDir);
  });
});
