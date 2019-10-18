'use strict';

const sinon = require('sinon');
const sandbox = sinon.createSandbox();
const assert = sinon.assert;

const fs = require('fs-extra');
const os = require('os');
const uuid = require('uuid');
const expect = require('expect.js');
const path = require('path');

const fileUtils = require('../../lib/utils/file');

const DEFAULT_IGNORED_FOLDER = [
  path.join('.fun', 'build'), 
  path.join('.fun', 'nas'), 
  path.join('.fun', 'tmp')
];

describe('test copySourceTo', () => {

  let tmpdir1;
  let tmpdir2;

  beforeEach(async () => {
    tmpdir1 = path.join(os.tmpdir(), uuid.v4());
    tmpdir2 = path.join(os.tmpdir(), uuid.v4());

    await fs.ensureDir(tmpdir1);
    await fs.ensureDir(tmpdir2);
  });

  afterEach(async () => {
    sandbox.restore();
    
    await fs.remove(tmpdir1);
    await fs.remove(tmpdir2);
  });

  it('test copySourceTo', async () => {
    await fs.writeFile(path.join(tmpdir1, 'a.txt'), 'a');
    await fs.mkdirp(path.join(tmpdir1, '.fun', 'build', 'b'));
    await fs.mkdirp(path.join(tmpdir1, '.fun', 'nas', 'c'));
    await fs.mkdirp(path.join(tmpdir1, '.fun', 'python'));
    await fs.writeFile(path.join(tmpdir1, 'd'), 'd');
    // to check funignore work
    await fs.writeFile(path.join(tmpdir1, '.fun', 'tmp'), 'content');


    await fileUtils.copySourceTo(tmpdir1, tmpdir2, ['d']);

    expect(await fs.readFile(path.join(tmpdir2, 'a.txt'), 'utf-8')).to.eql('a');
    expect(await fs.pathExists(path.join(tmpdir2, '.fun', 'build', 'b'))).to.be(false);
    expect(await fs.pathExists(path.join(tmpdir2, '.fun', 'nas', 'c'))).to.be(false);
    expect(await fs.pathExists(path.join(tmpdir2, '.fun', 'python'))).to.be(true);
    expect(await fs.pathExists(path.join(tmpdir2, 'd'))).to.be(false);
    // to check funignore work
    expect(await fs.pathExists(path.join(tmpdir2, '.fun', 'tmp', 'c'))).to.be(false);

  });
});

describe('test generateTmpDir', () => {

  afterEach(() => {
    sandbox.restore();
  });

  it('test generateTmpDir but randomDir dont exist', async () => {

    sandbox.stub(fs, 'pathExists').resolves(false);

    sandbox.stub(fs, 'ensureDir').resolves();

    await fileUtils.generateTmpDir();

    assert.calledWith(fs.pathExists, sinon.match.string);
    assert.calledWith(fs.ensureDir, sinon.match.string);
  });

  it('test generateTmpDir but randomDir exist', async () => {

    sandbox.stub(fs, 'pathExists').resolves(true);
    sandbox.stub(fs, 'ensureDir').resolves();

    await fileUtils.generateTmpDir();

    assert.calledWith(fs.pathExists, sinon.match.string);
    assert.notCalled(fs.ensureDir);
  });
});

describe('test checkRule', () => {
  it('checkRule', () => {
    expect(fileUtils.checkRule(DEFAULT_IGNORED_FOLDER, path.join('.fun', 'nas'))).to.be(true);
    expect(fileUtils.checkRule(DEFAULT_IGNORED_FOLDER, path.join('.fun', 'build'))).to.be(true);
    expect(fileUtils.checkRule(DEFAULT_IGNORED_FOLDER, path.join('.fun', 'tmp'))).to.be(true);
    expect(fileUtils.checkRule(DEFAULT_IGNORED_FOLDER, path.join('tmp', 'test'))).to.be(false);
    expect(fileUtils.checkRule(DEFAULT_IGNORED_FOLDER, path.join('tmp'))).to.be(false);
  });
});