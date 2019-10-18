'use strict';

const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const uuid = require('uuid');
const tempDir = require('temp-dir');
const util = require('util');
const ncp = require('../utils/ncp');
const ignore = require('./ignore');
const ncpAsync = util.promisify(ncp);

function checkRule(rules, file) {
  return _.some(rules, (rule) => {
    return file.endsWith(rule);
  });
}

// fs-extra could not copy subdirecties, and also could not copy a symbol link when target doesn't exist
// copydir(https://www.npmjs.com/package/copy-dir) could not copy a support symbol link for a file
async function copySourceTo(sourceDir, targetDir, excludeFiles) {
  if (!await fs.pathExists(targetDir)) {
    await fs.ensureDir(targetDir);
  }

  const ign = ignore(sourceDir);

  await ncpAsync(sourceDir, targetDir, {
    filter: (source) => {
      // skip copying any ignored files in sourceDir 
      if (ign && ign(source)) { return false; }

      if (excludeFiles) {
        if (checkRule(excludeFiles, source)) { return false; }
      }

      return true;
    }
  });
}

async function generateTmpDir() {
  const randomDirName = uuid.v4();
  const randomDir = path.join(tempDir, randomDirName);

  if (!await fs.pathExists(randomDir)) {
    await fs.ensureDir(randomDir);
  }

  return randomDir;
}

module.exports = {
  copySourceTo, generateTmpDir, checkRule
};