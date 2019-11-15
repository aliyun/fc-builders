#!/usr/bin/env node

'use strict';

const Builder = require('../lib/builder');
const log = require('../lib/utils/log');
const process = require('process');

const program = require('commander');

const handler = require('../lib/exception-handler');

program
  .version(require('../package.json').version, '--version')
  .description(
    `Build functions by automatically detecting supported manifests`
  );

program
  .option('--json-params <params>', 'build parameters represented by json'); // todo: 

program.parse(process.argv);

if (!program.jsonParams) {
  log.error('missing --json-params parameter');
  return;
}

const params = JSON.parse(program.jsonParams);

if (params.method !== 'build') {
  log.error('only build method is supported');
  return ;
}

const builder = new Builder(params.serviceName,
  params.functionName,
  params.sourceDir,
  params.runtime,
  params.artifactDir,
  params.verbose,
  params.stages);

builder.build().catch(handler);
