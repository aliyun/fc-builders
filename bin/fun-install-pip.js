'use strict';

const program = require('commander');

const handler = require('../lib/exception-handler');

program.command('install')
  .usage('-t|--target <target> [packages...]')
  .description('Install pip packages')
  .option('-t, --target <target>', 'path to install')
  .arguments('[packages...]')
  .action((packages) => {
    require('../lib/commands/pip')(packages, program.commands[0]).catch(handler);
  });

program.parse(process.argv);
