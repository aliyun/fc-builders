/* eslint-disable quotes */

'use strict';

const program = require('commander');

program
  .name('fun local')
  .description('build function codes or install related depedencies for Function Compute')
  .command('apt-get', 'install apt depencies')
  .command('pip', 'install pip depencies')
  .command('build', 'build function codes for Function Compute');

// Print help information if commands are unknown.
program.on('command:*', (cmds) => {
  if (!program.commands.map((command) => command.name()).includes(cmds[0])) {
    console.error();
    console.error("  error: unknown command '%s'", cmds[0]);
    program.help();
  }
});

program.parse(process.argv);
