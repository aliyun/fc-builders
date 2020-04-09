'use strict';

const program = require('commander');

const handler = require('../lib/exception-handler');

program.command('install')
  .usage('-t|--target <target> [packages...]')
  .description('Install npm packages')
  .option('-t, --target <target>', 'path to install')
  .option('--registry <url>', 'Configure npm to use any compatible registry, and even run your own registry.')
  .arguments('[packages...]')
  .action((packages) => {
    require('../lib/commands/npm')(packages, program.commands[0]).catch(handler);
  });

require('../lib/utils/command').registerCommandChecker(program);

program.parse(process.argv);
