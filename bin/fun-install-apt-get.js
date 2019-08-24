
const program = require('commander');

const handler = require('../lib/exception-handler');

program.command('install [packages...]')
  .description('Install apt packages')
  .arguments('packages')
  .action((packages) => {
    require('../lib/commands/apt-get')(packages, program).catch(handler);
  });

program.parse(process.argv);
