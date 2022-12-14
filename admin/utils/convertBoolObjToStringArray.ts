export function convertBoolObjToStringArray(obj: {
  [key: string]: boolean;
}): Array<string> {
  let arr: Array<string> = [];

  for (const [key, value] of Object.entries(obj)) {
    value ? arr.push(key) : arr;
  }
  return arr;
}
