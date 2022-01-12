'use strict';

const fs = require('fs-extra');
const path = require('path');

function getToolCachePath() {
  return process.env.TOOL_CACHE_PATH || '.fun';
}

function onlyCpoyManifestFile(sourceDir, artifactDir, manifestName) {
  if (process.env.ONLY_CPOY_MANIFEST_FILE !== 'true') {
    return false;
  }
  if (sourceDir === artifactDir) {
    return false;
  }

  try {
    const manifestFilePath = path.join(sourceDir, manifestName);
    if (fs.statSync(manifestFilePath).isFile()) {
      fs.copyFileSync(manifestFilePath, path.join(artifactDir, manifestName));
      return true;
    }
  } catch (ex) { console.error(ex.toString()); }
  return false;
}

module.exports = {
  getToolCachePath,
  onlyCpoyManifestFile
};