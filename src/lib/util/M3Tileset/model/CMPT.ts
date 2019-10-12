import Tile from "./Tile";
import B3DM from "./B3DM";

export default class CMPT extends Tile {
  tilesLength: number
  tilesBuffer: ArrayBuffer
  tiles: Tile[] = []

  static getTilesLenght(arrayBuffer: ArrayBuffer) {
    const buff = new Uint32Array(arrayBuffer)
    return buff[3];
  }
  static getTilesBuffer(arrayBuffer: ArrayBuffer) {
    return arrayBuffer.slice(16)
  }

  private _parseTiles(buff: ArrayBuffer) {
    const tileMagic = Tile.getMagic(buff);
    console.log(`    识别[${tileMagic}]`)
    let tile: any;
    switch (tileMagic) {
      case 'b3dm':
        tile = new B3DM(buff)
        break;
    }
    // tile && console.log('    构造tile', tile.toString())
    tile && this.tiles.push(tile)

    if (tile && tile.byteLength < buff.byteLength) {
      // 没完, 递归
      this._parseTiles(buff.slice(tile.byteLength));
    }
  }

  constructor(buff: ArrayBuffer) {
    super(buff)
    this.tilesLength = CMPT.getTilesLenght(buff);
    this.tilesBuffer = CMPT.getTilesBuffer(buff);
    console.log('    构造[cmpt]', this.toString())
    this._parseTiles(this.tilesBuffer);
  }

  toString() {
    const obj = JSON.parse(super.toString())
    return JSON.stringify(Object.assign({
      tilesLength: this.tilesLength
    }, obj))
  }
}