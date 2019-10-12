import AssetExtras from "./AssetExtras";

export default class Asset {
  version: string;
  tilesetVersion: string;
  extras: AssetExtras;

  constructor(asset: Asset) {
    this.version = asset.version;
    this.tilesetVersion = asset.tilesetVersion;
    this.extras = new AssetExtras(asset.extras);
  }
}
