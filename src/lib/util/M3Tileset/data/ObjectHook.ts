import { cloneDeep } from 'lodash';

export default class ObjectHook {
  clone() {
    return cloneDeep(this);
  }
}
