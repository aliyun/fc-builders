'use strict';

const program = require('commander');

const handler = require('../lib/exception-handler');

program.command('install')
  .usage('-t|--target <target> [packages...]')
  .description('Install pip packages')
  .option('-t, --target <target>', 'path to install')
  .option('-i, --index-url <url>', `Base URL of Python Package Index (default https://pypi.org/simple). This should point to a repository compliant with PEP 503 (the simple repository API) or a local
                       directory laid out in the same format.\n`)
  .arguments('[packages...]')
  .action((packages) => {
    require('../lib/commands/pip')(packages, program.commands[0]).catch(handler);
  });

require('../lib/utils/command').registerCommandChecker(program);

program.parse(process.argv);
