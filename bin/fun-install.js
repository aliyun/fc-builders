#!/usr/bin/env node

/* eslint-disable quotes */

'use strict';

const program = require('commander');

program
  .name('fun local')
  .description('build function codes or install related depedencies for Function Compute')
  .command('apt-get', 'install apt packages').alias('apt')
  .command('pip', 'install pip packages')
  .command('npm', 'install npm packages')
  .command('build', 'build function codes for Function Compute (Only used for funcraft)');

require('../lib/utils/command').registerCommandChecker(program);

program.parse(process.argv);
