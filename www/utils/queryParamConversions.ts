export function queryParamToStringArray(str: string | string[] | undefined) {
  if (typeof str === 'string') {
    return str?.length ? `${str}`?.split(',') : [];
  }

  return [];
}

export function queryParamToString<T = 'string'>(
  str: string | string[] | undefined,
): T {
  if (typeof str === 'string') {
    return <T>str;
  }
  return <T>'';
}
