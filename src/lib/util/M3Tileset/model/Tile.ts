
export default class Tile {
  raw: ArrayBuffer
  magic: string
  version: number
  byteLength: number

  static getMagic(arrayBuffer: ArrayBuffer) {
    const buff = new Uint8Array(arrayBuffer);
    return String.fromCharCode.apply(null, buff.subarray(0, 4));
  }
  static getVersion(arrayBuffer: ArrayBuffer) {
    return (new Uint32Array(arrayBuffer))[1]
  }
  static getByteLenght(arrayBuffer: ArrayBuffer) {
    return (new Uint32Array(arrayBuffer))[2]
  }

  constructor(buff: ArrayBuffer) {
    // console.log('超类构造', buff)
    this.raw = buff;
    this.magic = Tile.getMagic(buff);
    this.version = Tile.getVersion(buff);
    this.byteLength = Tile.getByteLenght(buff);
  }

  toString() {
    return JSON.stringify({
      magic: this.magic,
      version: this.version,
      byteLength: this.byteLength
    })
  }
}