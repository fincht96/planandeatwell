import { Directus } from '@directus/sdk';
import HeadlessCmsInterface from './headless_cms_interface';

// In directus a collection is equivalent to a database table.
type MyCollections = {
  recipes: {
    id: number;
    name: string;
    instruction: string;
  };
};

const directusAppUrlLocal = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}`;

class DirectusCMS implements HeadlessCmsInterface {
  directus: any;

  constructor() {
    this.directus = new Directus<MyCollections>(directusAppUrlLocal);
  }

  async getSpecificRows(collectionName: string, rowIds: Array<number>) {
    const resources = await this.directus
      .items(collectionName)
      .readMany(rowIds);
    return resources;
  }

  async getAllRowsInCollection(collectionName: string) {
    // By default directus API limits results to 100.
    // With -1, it will return all results, but it may lead to performance degradation for large result sets.
    const allResources = await this.directus
      .items(collectionName)
      .readByQuery({ limit: -1, meta: 'total_count' });
    return allResources;
  }

  async getSingleRowInCollection(collectionName: string, rowId: number) {
    const resource = await this.directus.items(collectionName).readOne(rowId);
    return resource;
  }
}

export default DirectusCMS;
