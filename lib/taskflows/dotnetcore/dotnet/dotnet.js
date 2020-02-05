'use strict';

const path = require('path');

function generatePublishedArtifactsDir(sourceDir, runtime) {
  return path.join(
    sourceDir,
    'bin',
    'Release',
    runtime
  );
}

module.exports = {
  generatePublishedArtifactsDir
};
