import Content from "./Content";
import BoundingVolume from "./BoundingVolume";
import ViewerRequestVolume from "./ViewerRequestVolume";

export default class Child {
  viewerRequestVolume: ViewerRequestVolume;
  boundingVolume: BoundingVolume;
  geometricError: number;
  refine: string;
  content: Content;
  children: Child[];
  transform: number[];

  constructor(child: Child) {
    this.boundingVolume = new BoundingVolume(child.boundingVolume);
    this.geometricError = child.geometricError;
    this.refine = child.refine;
    this.content = child.content ? new Content(child.content) : undefined;
    this.children = child.children ? child.children.map((child) => { return new Child(child) }) : [];
    this.transform = child.transform;
  }

  ensureViewerRequestVolume(scale = 1, limit = 30000) {
    const bv = this.boundingVolume
    if (bv.size < limit) {
      this.viewerRequestVolume = this.boundingVolume.clone();
      this.viewerRequestVolume.scale(scale);
    }
    this.children.forEach(child => {
      child.ensureViewerRequestVolume(scale);
    })
  }


  async traverse(callback: (node: Child) => Child) {
    const { children } = this;
    await callback(this);
    if (!children || !children.length) return;

    for (let cl of children) {
      await cl.traverse(callback)
    }
  }

  get size() {
    return this.boundingVolume.size;
  }
}
