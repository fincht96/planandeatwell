export const sliceArrayIntoChunks = (arr: Array<any>, chunkSize = 5) => {
  if (chunkSize < 5) {
    throw new Error('Chunk size must be > 4');
  }
  let res: Array<any> = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res = [...res, chunk];
  }
  return res;
};
