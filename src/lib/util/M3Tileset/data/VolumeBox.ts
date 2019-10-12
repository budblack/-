export default class VolumeBox extends Array {

  constructor(box: number[]) {
    super();
    /**
     * [w,s,e,n,l,u]
     */
    for (let i = 0; i < 12; i++) {
      this[i] = box[i];
    }
  }

  scale(scale: number) {
    for (let i = 3; i < 12; i++) {
      this[i] = this[i] * scale;
    }
    return this;
  }

  get center(): number[] {
    const [cx, cy, cz] = this;

    return [cx, cy, cz];
  }
}