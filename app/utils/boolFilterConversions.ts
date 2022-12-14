import { BoolObject } from '../types/filter.types';

export function convertStringArrayToBoolObj(array: Array<string>): BoolObject {
  return array.reduce((prev, current) => ({ ...prev, [current]: true }), {});
}

export function convertBoolObjToStringArray(obj: BoolObject): Array<string> {
  let arr: Array<string> = [];

  for (const [key, value] of Object.entries(obj)) {
    value ? arr.push(key) : arr;
  }
  return arr;
}
