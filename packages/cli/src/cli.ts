import yargs from 'yargs';
import { extract } from './extract';

const getMoreInformationMessage = `For more information about this tool, visit the projects home.

https://github.com/luke_john/figma-code-extractor`;

yargs
  .scriptName('@figma-code-extractor/cli')
  .version()
  .command('extract', 'Extract code from figma', {}, argv => {
    extract({ verbose: (argv.verbose as boolean) ?? false });
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  })
  .epilogue(getMoreInformationMessage).argv;
