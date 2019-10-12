/** ******************************************************************************************************
 *  3DTile 使用了一些酷炫的设计来组织模型数据. 
 *  我们需要知道 [模型根本上就是glb], 3DTile 引入的各种格式都是对于它的[封装]以及[封装的再封装]
 * 
 *  [b3dm], 含有 batchtable 的数据头部
 * 
 *  [cmpt] 打包存储的模型组. 该文件头部具有一个CMPT头, 紧接着可能是若干个连续存放的数据(tile)
 *         这些数据自身可能是完整的 [b3dm] 或者 [i3dm] 等
 * 
 *  
 *********************************************************************************************************/

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import program from 'commander';
import symbols from 'log-symbols';
import M3Tileset from '../util/M3Tileset';

const dbmap: any[] = [];
(async () => {
  const Cesium = await importCesium();
  const thetileseturl = `blog.7cdn.msign.net/ms-static/remote/testdat/[20190801]LHKJD/tileset.json`;
  const mockTileset = new Cesium.Cesium3DTileset({ url: thetileseturl });
  // console.log('mockTileset\n', mockTileset)
  const mockResource = Cesium.Resource.createIfNeeded(thetileseturl)
  const mockRoot = {
    "boundingVolume": {
      "box": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    }
  }
  const mockTile = new Cesium.Cesium3DTile(mockTileset, mockResource, mockRoot);
  console.log('mockTile\n', mockTile)

  program
    .option('-i, --input [path]', '输入 tileset.json 文件路径.')
    .parse(process.argv);

  if (!program.input) {
    process.exit(1);
  }

  function getMagic(arrayBuffer: ArrayBuffer) {
    const buff = new Uint8Array(arrayBuffer)
    return String.fromCharCode.apply(null, buff.subarray(0, 4));
  }

  async function importCesium(): Promise<any> {
    return new Promise((resolve, reject) => {
      const requirejs = require('requirejs');
      requirejs.config({ nodeRequire: require });
      requirejs(
        ['cesium'],
        resolve
      );
    });
  }

  function extractProps(tile: any, ) {
    const bt = tile.batchTable;
    // console.log(bt._properties)
    console.log(`     遍历要素集`)
    for (let i = 0; i < tile.featuresLength; i++) {
      console.log(`       batchId: ${i}`);
      const props: any = {};
      for (let name in bt._properties) {
        props[name] = bt.getProperty(i, name);
      }
      // console.log(props);
      // 仅仅有这个
      dbmap[props.DbId] = props
    }
  }
  async function cb(node: any) {
    const { content } = node;
    // console.log('.遍历节点', content)
    if (!content) return;
    const { uri } = content
    if (!uri) return
    console.log(symbols.success, '读取资源', uri)
    // new Cesium3DTileContent()

    // buff 即模型单文件
    const filepath = path.resolve(program.input, '..', uri);
    const buff = await fs.readFile(filepath)
    // fs 读取的数据是 Buffer 类型, Cesium 中使用的是 ArrayBuffer
    const ab = new ArrayBuffer(buff.length);
    var view = new Uint8Array(ab);
    for (let i = 0; i < buff.length; ++i) {
      view[i] = buff[i];
    }
    console.log(symbols.success, '读文件', ab)
    var uint8Array = new Uint8Array(ab);
    var magic = getMagic(uint8Array);
    // var contentFactory = Cesium3DTileContentFactory[magic];
    console.log(symbols.success, '  解析文件格式', magic)
    // 关于格式, 见代码顶部解释
    let tile

    switch (magic) {
      case 'cmpt':
        tile = Cesium.Cesium3DTileContentFactory.cmpt(mockTileset, mockTile, mockResource, ab, 0)
        console.log(`  打包格式, 共[${tile._contents.length}]条, 准备遍历`);
        tile._contents.forEach((subtile: any, i: number) => {
          console.log(`   第[${i + 1}]`, subtile.constructor.name)
          console.log(`   打印属性表, 要素集共[${subtile.featuresLength}]条要素`)
          extractProps(subtile);
        })
        break;
      case 'b3dm':
        tile = Cesium.Cesium3DTileContentFactory.b3dm(mockTileset, mockTile, mockResource, ab, 0)
        extractProps(tile);
        break;
      case 'i3dm':
        tile = Cesium.Cesium3DTileContentFactory.i3dm(mockTileset, mockTile, mockResource, ab, 0)
        extractProps(tile);
        break;
    }
    tile && console.log('  Tile 构造成功:', magic)
    // const ContentFactory = Cesium3DTileContentFactory[magic];
    // try {
    //   await ContentFactory(tileset, that, that._contentResource, ab, 0);
    // } catch (e) {
    //   console.log(symbols.error, '  载入模型文件出错', e)
    // }
  }

  async function main() {
    const inputFile = program.input;
    // const outputFile = program.output;
    console.log(symbols.success, '[输入文件]', inputFile);
    const tilesetFile = path.resolve(inputFile);
    console.log(symbols.success, '[载入文件]', tilesetFile);
    const tilesetJson = require(tilesetFile);
    console.log(symbols.success, '[解析文件]');
    const tileset = await M3Tileset.fromJSON(tilesetJson);
    console.log(symbols.success, '[解析完毕]');
    console.log(symbols.success, `[从根开始遍历节点]`);
    await tileset.traverse(cb);
    console.log(symbols.success, '[遍历完成]');
    console.log('属性表', dbmap.length)
  }
  main()
})()