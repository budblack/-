import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import program from 'commander';
import symbols from 'log-symbols';
import M3Tileset from '../util/M3Tileset'


program
  .option('-i, --input [path]', '输入 tileset.json 文件路径.')
  .option('-o, --output [path]', '输出 tileset.json 文件路径.')
  .option('-s, --scale [number]', '放大参数, 默认 1.')
  .parse(process.argv);

if (!program.input) {
  process.exit(1);
}

(async () => {
  const inputFile = program.input;
  const outputFile = program.output;
  const scale = program.scale || 1;
  console.log(symbols.success, '[输入文件]', inputFile);
  const tilesetFile = path.resolve(inputFile);
  console.log(symbols.success, '[载入文件]', tilesetFile);
  const tilesetJson = require(tilesetFile);
  console.log(symbols.success, '[解析文件]');
  const tileset = await M3Tileset.fromJSON(tilesetJson);
  const tilesetCp = tileset.clone();
  console.log(symbols.success, '[解析完毕]');
  console.log(symbols.success, `[从包络体计算可视区]`, `放大参数: ${scale}`);
  tilesetCp.ensureViewerRequestVolume(scale);
  tilesetCp.asset.tilesetVersion = (new Date()).toString();
  console.log(symbols.success, '[计算完毕]');

  if (outputFile) {
    // 写入文件
    const outputFilePath = path.resolve(outputFile)
    await fs.ensureFile(outputFilePath);

    console.log(symbols.info, '[写文件]', outputFilePath);
    fs.writeJSON(outputFilePath, tilesetCp);
  }
})()