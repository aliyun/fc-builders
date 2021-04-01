'use strict';

const { getToolCachePath } = require('../utils/utils');
const parser = require('git-ignore-parser'),
  ignore = require('ignore'),
  fs = require('fs-extra'),
  path = require('path');

module.exports = function (baseDir) {
  const toolCachePath = getToolCachePath();
  const ignoredFile = ['.git', '.svn', '.env', `${toolCachePath}/nas`, `${toolCachePath}/tmp`, '.DS_Store', `${toolCachePath}/build`];

  const ignoreFilePath = `${baseDir}/.funignore`;

  var fileContent = '';

  if (fs.existsSync(ignoreFilePath)) {
    fileContent = fs.readFileSync(`${baseDir}/.funignore`, 'utf8');
  }

  const ignoredPaths = parser(`${ignoredFile.join('\n')}\n${fileContent}`);

  const ig = ignore().add(ignoredPaths);
  return function (f) {
    const relativePath = path.relative(baseDir, f);
    if (relativePath === '') { return false; }
    return ig.ignores(relativePath);
  };
};