import Asset from "./Asset";
import Root from "./Root";
import TilesetExtras from "./TilesetExtras";
import ObjectHook from "./ObjectHook";

export default class Tileset extends ObjectHook {
  asset: Asset;
  geometricError: number;
  root: Root;
  extras: TilesetExtras;
}