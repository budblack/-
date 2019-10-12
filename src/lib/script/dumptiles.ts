import fs from 'fs-extra';
import path from 'path';
import program from 'commander';
import symbols from 'log-symbols';
import M3Tileset from '../util/M3Tileset';
import fetch from 'node-fetch';

program
  .option('-i, --ionID [string]', 'Ion ID.')
  .option('-o, --output [path]', 'save dir.')
  .option('-t, --token [string]', 'acces_token')
  .parse(process.argv);

async function dump(uri: string, token: string) {
  return fetch(uri, {
    method: 'get',
    headers: {
      Accept: `application/json,*/*;q=0.01,*/*;access_token=${token}`
    }
  });
}
(async () => {
  const { ionID, output, token } = program;
  console.log(symbols.info, { ionID, output, token });

  const json = await (await dump(
    `https://assets.cesium.com/${ionID}/tileset.json?v1`,
    token
  )).json();
  if (json.root) {
    console.log(symbols.success, '索引拉取成功');
  } else {
    console.log(symbols.info, json);
    console.log(symbols.success, '索引拉取失败, 退出');
    process.exit(1);
  }
  await fs.ensureDir(output);
  await fs.writeJSON(path.join(output, 'tileset.json'), json);
  const tileset = new M3Tileset(json);
  console.log(
    symbols.success,
    '实例化Tileset, Version: ',
    tileset.asset.version
  );
  console.log(symbols.info, '开始遍历');
  let i = 1;
  const uris: string[] = [];
  await tileset.traverse(async node => {
    if (!node.content) {
      return;
    }
    // console.log(symbols.info, `${i}`, node.content);
    const { uri } = node.content;
    uris.push(uri);
    i++;
  });
  console.log(symbols.info, `共计 ${uris.length} 条资源`);
  // let n = 4;
  for (let i = 0; i < uris.length; i += 1) {
    const uri = uris[i];
    const content = await dump(
      `https://assets.cesium.com/${ionID}/${uri}?v=1`,
      token
    );
    const buf = await content.buffer();
    console.log(symbols.info, `${i}: ${uri}: ${buf.length} Byte.`);
    await fs.ensureDir(path.dirname(path.join(output, uri)));
    await fs.writeFile(path.join(output, uri), buf);
  }
})();
