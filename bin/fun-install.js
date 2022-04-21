#!/usr/bin/env node

/* eslint-disable quotes */

'use strict';

const program = require('commander');

if (process.env.S_SANDBOX === 's_sandbox') {
  process.env.TOOL_CACHE_PATH = '.s'; // 将依赖下载的到指定目录
  program
    .name('s sandbox')
    .description('build function codes or install related depedencies for Function Compute')
    .command('apt-get', 'install apt packages').alias('apt')
    .command('pip', 'install pip packages');
} else {
  program
    .name('fun local')
    .description('build function codes or install related depedencies for Function Compute')
    .command('apt-get', 'install apt packages').alias('apt')
    .command('pip', 'install pip packages')
    .command('npm', 'install npm packages')
    .command('build', 'build function codes for Function Compute (Only used for funcraft)');
}

require('../lib/utils/command').registerCommandChecker(program);

program.parse(process.argv);
