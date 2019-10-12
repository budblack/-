import Cesium from "./Cesium";

export default class AssetExtras {
  copyright: string;
  generator: string;
  cesium: Cesium;

  constructor(extras: AssetExtras) {
    this.cesium = new Cesium(extras.cesium);
    this.generator = extras.generator;
    this.copyright = extras.copyright;
  }
}