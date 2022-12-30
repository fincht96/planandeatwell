import { Request, Response } from 'express';
import EventsService from '../services/events_service';
import SupermarketsService from '../services/supermarkets_service';
import Joi from 'joi';

const getSupermarketsSchema = Joi.object({
  orderBy: Joi.string().valid('createdAt'),
  order: Joi.string().valid('asc', 'desc'),
}).and('orderBy', 'order');

export default class SupermarketsController {
  constructor(
    private readonly supermarketsService: SupermarketsService,
    private readonly eventsService: EventsService,
  ) {}

  async getSupermarkets(req: Request, res: Response) {
    try {
      const { error, value } = getSupermarketsSchema.validate(req.query);

      if (error) {
        throw new Error(error.message);
      }

      const supermarkets = await this.supermarketsService.getSupermarkets(
        value,
      );

      return res.status(200).json({
        result: supermarkets,
        errors: [],
      });
    } catch (e: any) {
      await this.eventsService.insert('SUPERMARKETS', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }
}
