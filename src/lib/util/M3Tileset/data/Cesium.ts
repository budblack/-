import Credit from "./Credit";

export default class Cesium {
  credits: Credit[];

  constructor(cesium: Cesium) {
    this.credits = [new Credit()];
  }
}
