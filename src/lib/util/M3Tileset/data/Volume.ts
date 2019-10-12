import ObjectHook from "./ObjectHook";
import VolumeBox from "./VolumeBox";
import VolumeRegion from "./VolumeRegion";

export default class Volume extends ObjectHook {
  box: VolumeBox;
  region: VolumeRegion;

  constructor(volume: Volume) {
    super();
    this.box = volume.box ? new VolumeBox(volume.box) : undefined;
    this.region = volume.region ? new VolumeBox(volume.region) : undefined;
  }

  scale(scale: number = 1) {
    const { box } = this;
    box.scale(scale);
  }

  get size() {
    const { box } = this;
    let rr=0
    if (box) {
      for(let i =3;i<12;i++) {
        rr+box[i]*box[i]
      }
    }
    return rr;
  }
}