
import Asset from "./data/Asset";
import Root from "./data/Root";
import TilesetExtras from "./data/TilesetExtras";
import Tileset from "./data/Tileset";
import Child from "./data/Child";

export default class M3Tileset extends Tileset {
  static async fromJSON(tileset: Tileset) {
    const m3Tileset = new M3Tileset(tileset);

    return m3Tileset;
  }

  constructor(tileset: Tileset = new Tileset()) {
    super();

    this.asset = new Asset(tileset.asset);
    this.geometricError = tileset.geometricError;
    this.extras = new TilesetExtras(tileset.extras);
    this.root = new Root(tileset.root);
  }

  ensureViewerRequestVolume(scale = 1) {
    this.root.ensureViewerRequestVolume(scale);
  }

  async traverse(callback: (node: Child) => any) {
    const { root } = this;

    await root.traverse(callback)
  }
}