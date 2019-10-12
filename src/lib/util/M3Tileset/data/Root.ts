import BoundingVolume from "./BoundingVolume";
import Child from "./Child";
import Content from "./Content";

export default class Root extends Child {
  constructor(root: Root) {
    super(root);
  }
}
