interface HeadlessCmsInterface {
  getAllRowsInCollection: (collectionName: string) => Promise<any>;
  getSingleRowInCollection: (
    collectionName: string,
    rowId: number,
  ) => Promise<{ data: Array<any> }>;
  getSpecificRows: (
    collectionName: string,
    rowIds: Array<number>,
  ) => Promise<any>;
}

export default HeadlessCmsInterface;
