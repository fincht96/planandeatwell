import { Request, Response } from 'express';
import EventsService from '../services/events_service';
import Joi from 'joi';
import StorageService from '../services/storage_service';

const getSignedUploadUrlSchema = Joi.object({
  objectKey: Joi.string().max(200).required(),
  contentType: Joi.string().max(50).required(),
  acl: Joi.string().max(50).required(),
}).and('objectKey', 'contentType');

export default class StorageController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly storageService: StorageService,
  ) {}

  async getSignedUploadUrl(req: Request, res: Response) {
    try {
      const { error, value } = getSignedUploadUrlSchema.validate(req.query);

      if (error) {
        throw new Error(error.message);
      }

      const result = await this.storageService.createSignedUploadUrl(
        value.objectKey,
        value.contentType,
        value.acl,
      );

      return res.status(200).json({
        result,
        errors: [],
      });
    } catch (e: any) {
      await this.eventsService.insert(
        'STORAGE_CONTROLLER',
        'ERROR',
        e.message ?? '',
      );
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }
}
