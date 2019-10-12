#!/usr/bin/env node
import chalk from 'chalk';
import program from 'commander';
import symbols from 'log-symbols';

import Traverser from './lib/util/Traverser';

program.version('0.1.0812', '-v, --version')
  .command('traverse <path>')
  .action((path: string) => {
    console.log(symbols.info, chalk.green(`遍历目录[${path}]`));
    const traverser = new Traverser(path);
    const files = traverser.files;
    console.log(symbols.success, chalk.green(`${files.length} 条文件.`));

  });
program.parse(process.argv);