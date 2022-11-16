import { Knex } from 'knex';
import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import AppConfig from '../configs/app.config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default class StorageService {
  private s3Client: S3Client;
  constructor(private readonly appConfig: AppConfig) {
    this.s3Client = new S3Client({
      endpoint: this.appConfig.spacesEndpoint, // Find your endpoint in the control panel, under Settings. Prepend "https://".
      forcePathStyle: false,
      region: this.appConfig.spacesRegion, // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
      credentials: {
        accessKeyId: this.appConfig.spacesKey, // Access key pair. You can create access key pairs using the control panel or API.
        secretAccessKey: this.appConfig.spacesSecret, // Secret access key defined through an environment variable.
      },
    });
  }

  async createSignedUploadUrl(
    objectKey: string,
    contentType: string,
    acl: string,
  ) {
    const bucketParams = {
      Bucket: this.appConfig.spacesBucket,
      Key: objectKey,
      ContentType: contentType, // image/png
      ACL: acl, //'public-read', canned s3 acl
    };

    const url = await getSignedUrl(
      this.s3Client,
      new PutObjectCommand(bucketParams),
      { expiresIn: 15 * 60 },
    );
    return url;
  }

  async deleteFile(objectKey: string) {
    const bucketParams = {
      Bucket: this.appConfig.spacesBucket,
      Key: objectKey,
    };

    const data = await this.s3Client.send(
      new DeleteObjectCommand(bucketParams),
    );
    return data;
  }
}
