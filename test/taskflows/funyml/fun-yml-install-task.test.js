'use strict';

const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const assert = sinon.assert;

const FunYmlInstallTask = require('../../../lib/taskflows/funyml/fun-yml-install-task');

const install = require('../../../lib/install/install');

describe('test FunYmlInstallTask', () => {
  const buildDir = '/build';

  beforeEach(async () => {
    sandbox.stub(install, 'installFromYaml').resolves({});
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('test FunYmlInstallTask', async () => {

    const funYmlInstallTask = new FunYmlInstallTask(buildDir);

    await funYmlInstallTask.run();

    assert.calledWith(install.installFromYaml, '/build/fun.yml');
  });
});
