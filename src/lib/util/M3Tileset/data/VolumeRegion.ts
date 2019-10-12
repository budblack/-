export default class VolumeBox extends Array {

  constructor(box: number[]) {
    super();
    /**
     * [w,s,e,n,l,u]
     */
    for (let i = 0; i < 6; i++) {
      this[i] = box[i];
    }
  }

  scale(scale: number) {
    const [w, s, e, n, l, u] = this;
    const c = this.center
    const ww = w + (w - c[0]) * scale;
    const ee = e + (e - c[0]) * scale;
    const ss = s + (s - c[1]) * scale;
    const nn = n + (n - c[1]) * scale;
    const ll = l + (l - c[2]) * scale;
    const uu = u + (u - c[2]) * scale;
    this.length=0;
    this.push(...[ww,ss,ee,nn,ll,uu]);
  }

  get center(): number[] {
    const [w, s, e, n, l, u] = this;

    return [(w + e) / 2, (s + n) / 2, (l + n) / 2];
  }
}