import HeadlessCmsInterface from './headless_cms_interface';

class HeadlessCMSService {
  headlessCMS: any;

  constructor(headlessCMS: any) {
    this.headlessCMS = headlessCMS;
  }

  // use to switch to another headless cms provider i.e. strapi
  setHeadlessCms(headlessCms: HeadlessCmsInterface) {
    this.headlessCMS = headlessCms;
  }

  getSpecificResources = async (
    resourceName: string,
    resourceIds: Array<number>,
  ) => {
    try {
      const resources = await this.headlessCMS.getSpecificRows(
        resourceName,
        resourceIds,
      );

      return resources;
    } catch (error: any) {
      console.log('error:', error.message);
      // handle more elegantly
      return;
    }
  };

  getAllResources = async (resourceName: string) => {
    try {
      const resources = await this.headlessCMS.getAllRowsInCollection(
        resourceName,
      );

      return resources;
    } catch (error: any) {
      console.log('error:', error.message);
      // handle more elegantly
      return;
    }
  };

  getSingleResource = async (resourceName: string, resourceId: number) => {
    try {
      const resource = await this.headlessCMS.getSingleRowInCollection(
        resourceName,
        resourceId,
      );
      return resource;
    } catch (error: any) {
      console.log('error:', error.message);
      // handle more elegantly
      return;
    }
  };
}

export default HeadlessCMSService;
