'use strict';

const path = require('path');

function generatePublishedArtifactsDir(sourceDir, runtime, config = 'Release') {
  return path.join(
    sourceDir,
    'bin',
    config,
    runtime
  );
}

module.exports = {
  generatePublishedArtifactsDir
};
