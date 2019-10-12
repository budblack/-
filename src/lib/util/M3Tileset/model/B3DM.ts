import Tile from "./Tile";

export default class B3DM extends Tile {

  static getFeatureTableJSONByteLength(buff: ArrayBuffer) {
    return (new Uint32Array(buff))[3]
  }
  static getFeatureTableBinaryByteLength(buff: ArrayBuffer) {
    return (new Uint32Array(buff))[4]
  }
  static getFeatureTableBinary(buff: ArrayBuffer) {

  }

  private featureTableJSONByteLength: number;
  private featureTableBinaryByteLength: number;
  private batchTableJSONByteLength: number;
  private batchTableBinaryByteLength: number;
  private batchTableJSONBuffer: ArrayBuffer;
  private featureTableJSONBuffer: ArrayBuffer;
  private bodyBuffer: ArrayBuffer;

  private _parseTable() {
    // featureTable batchTable
    const { batchTableJSONBuffer, featureTableJSONBuffer, bodyBuffer, featureTableBinaryByteLength, batchTableBinaryByteLength } = this;

    const batchTable = String.fromCharCode.apply(null, batchTableJSONBuffer);
    const featureTable = String.fromCharCode.apply(null, featureTableJSONBuffer);
    console.log(`      要素表头`, featureTable);
    console.log(`      要素表长度`, featureTableBinaryByteLength);
    console.log(`      属性表结构`, batchTable);
    console.log(`      属性表长度(对齐 8 字节)`, batchTableBinaryByteLength);

    const { BATCH_LENGTH } = JSON.parse(featureTable)
    const BATCH_TABLE = JSON.parse(batchTable)
    console.log(`      属性表结构(结构化)\n`, BATCH_TABLE);
    console.log(`      要素数量`, BATCH_LENGTH);
    const abFeature = bodyBuffer.slice(0, featureTableBinaryByteLength)
    const abBatch = bodyBuffer.slice(featureTableBinaryByteLength, featureTableBinaryByteLength + batchTableBinaryByteLength);
    console.log(`      属性表\n`, new Float32Array(abBatch));

    /** ************************************
    * "BYTE"	1
    * "UNSIGNED_BYTE"	1
    * "SHORT"	2
    * "UNSIGNED_SHORT"	2
    * "INT"	4
    * "UNSIGNED_INT"	4
    * "FLOAT"	4
    * "DOUBLE"	8
    ***************************************/
    const props: any = {}
    for (let prop in BATCH_TABLE) {
      const { byteOffset, componentType, type } = BATCH_TABLE[prop]
      switch (componentType) {
        case 'BYTE':
        case 'UNSIGNED_BYTE':
          props[prop] = new Uint8Array(abBatch.slice(byteOffset * BATCH_LENGTH, 1 * BATCH_LENGTH));
          break;
        case 'SHORT':
          props[prop] = new Int16Array(abBatch.slice(byteOffset * BATCH_LENGTH, 2 * BATCH_LENGTH));
          break;
        case 'UNSIGNED_SHORT':
          props[prop] = new Uint16Array(abBatch.slice(byteOffset * BATCH_LENGTH, 2 * BATCH_LENGTH));
          break;
        case 'UNSIGNED_INT':
          props[prop] = new Uint32Array(abBatch.slice(byteOffset * BATCH_LENGTH, 4 * BATCH_LENGTH));
          break;
        case 'INT':
          props[prop] = new Int32Array(abBatch.slice(byteOffset * BATCH_LENGTH, 4 * BATCH_LENGTH));
          break;
        case 'FLOAT':
          props[prop] = new Float32Array(abBatch.slice(byteOffset * BATCH_LENGTH, 4 * BATCH_LENGTH));
          break;
        case 'DOUBLE':
          props[prop] = new Float64Array(abBatch.slice(byteOffset * BATCH_LENGTH, 8 * BATCH_LENGTH));
          break;
      }
    }
    console.log('    得到属性\n', props)
  }

  constructor(buff: ArrayBuffer) {
    super(buff);
    const view32 = new Uint32Array(buff);
    const view8 = new Uint8Array(buff);
    const head = view32.subarray(0, 7);
    const body = view32.subarray(7);
    const lenTableFeature = this.featureTableJSONByteLength = head[3];
    this.featureTableBinaryByteLength = head[4];
    const lenTableBatch = this.batchTableJSONByteLength = head[5];
    this.batchTableBinaryByteLength = head[6];
    const tableFeature = this.featureTableJSONBuffer = view8.subarray(28, 28 + lenTableFeature)
    const tableBatch = this.batchTableJSONBuffer = view8.subarray(28 + lenTableFeature, 28 + lenTableFeature + lenTableBatch)
    const bodyBuffer = this.bodyBuffer = view8.subarray(28 + lenTableFeature + lenTableBatch).buffer
    console.log(`      头部`, head);
    console.log(`      要素表JSON区尺寸有[${lenTableFeature}]字节`);
    console.log(`      属性表JSON区尺寸有[${lenTableBatch}]字节`);

    this._parseTable();
  }

  toString() {
    const obj = JSON.parse(super.toString())
    return JSON.stringify(Object.assign({
      featureTableJSONByteLength: this.featureTableJSONByteLength,
      featureTableBinaryByteLength: this.featureTableBinaryByteLength,
    }, obj))
  }
}