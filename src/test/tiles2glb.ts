import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import program from 'commander';
import symbols from 'log-symbols';

const Draco3d = require('draco3d');
const draco3dDecoderModule = Draco3d.createDecoderModule({});
const draco3dEncoderModule = Draco3d.createEncoderModule({});

async function readDir(root: string, recursive = false, ext = ['.b3dm', '.i3dm', '.gltf', '.glb']): Promise<string[]> {
  const files: string[] = [];
  const children = await fs.readdir(root);
  for (let child of children) {
    const sub = path.resolve(root, child)
    const cStat = await fs.stat(sub)
    // cStat.isFile() && console.log(chalk.green(`[文件][${path.extname(sub).toLowerCase()}]`), chalk.green(`${sub}`));
    // cStat.isDirectory() && console.log(chalk.blue("[目录]"), chalk.blue(`${sub}`));
    if (cStat.isFile() && ext.indexOf(path.extname(sub).toLowerCase()) > -1) {
      files.push(sub);
    } else if (cStat.isDirectory() && recursive) {
      files.push(...await readDir(sub, recursive, ext));
    }
  }

  return files;
}
program
  .command('traverse <path>')
  .action(async (root: string) => {
    console.log(symbols.info, chalk.green(`批量将tiles 文件转换为标准 glb [${root}]`));
    const files = await readDir(root, true);
    console.log(symbols.success, chalk.green(`${files.length} 条文件.`));

    console.log(symbols.info, chalk.yellow(`开始处理`));
    for (let file of files) {
      console.log(chalk.green(`[文件][${path.extname(file).toLowerCase()}]`), chalk.green(`${file}`));

    }
  });
program.parse(process.argv);