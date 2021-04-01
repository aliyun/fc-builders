'use strict';

function getToolCachePath() {
  return process.env.TOOL_CACHE_PATH || '.fun';
}

module.exports = {
  getToolCachePath,
}