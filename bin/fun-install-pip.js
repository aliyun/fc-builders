
const program = require('commander');

const handler = require('../lib/exception-handler');

program.command('install [packages...]')
  .description('Install pip packages')
  .arguments('packages')
  .action((packages) => {
    require('../lib/commands/pip')(packages, program).catch(handler);
  });

program.parse(process.argv);
