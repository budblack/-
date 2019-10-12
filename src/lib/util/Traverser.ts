import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import symbols from 'log-symbols';

export default class Traverser {

  private _root: string;
  private _files: string[] = [];

  private _clear() {
    const { _files: files } = this;
    files.length = 0;
  }
  private async _readDir(root: string, recursive = false) {
    const { _files: files } = this;
    const children = await fs.readdir(root);

    for (let child of children) {
      const sub = path.resolve(root, child)
      const cStat = await fs.stat(sub)
      if (cStat.isFile()) {
        console.log(symbols.info, chalk.green(`  文件[${sub}]`));
        files.push(sub);
      } else if (cStat.isDirectory()) {
        console.log(symbols.info, chalk.green(`  目录[${sub}]`));
        this._readDir(sub);
      }
    }

    return children;
  }

  constructor(root: string) {
    this._root = path.resolve(root);

    this._clear();
    this._readDir(root);
  }

  async next() {

  }

  get files() {
    return this._files;
  }
}
