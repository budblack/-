import BIMANGLEGeoreferencing from "./BIMANGLEGeoreferencing";
import ObjectHook from "./ObjectHook";

export default class TilesetExtras extends ObjectHook {

  constructor(tilesetExtras: TilesetExtras) {
    super();
    Object.assign(this, tilesetExtras);
  }
}