import { Request, Response } from 'express';
import EventsService from '../services/events_service';
import CategoriesService from '../services/categories_service';
import Joi from 'joi';

const getCategoriesSchema = Joi.object({
  orderBy: Joi.string().valid('createdAt'),
  order: Joi.string().valid('asc', 'desc'),
}).and('orderBy', 'order');

export default class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly eventsService: EventsService,
  ) {}

  async getCategories(req: Request, res: Response) {
    try {
      const { error, value } = getCategoriesSchema.validate(req.query);

      if (error) {
        throw new Error(error.message);
      }

      const categories = await this.categoriesService.getCategories(value);

      return res.status(200).json({
        result: categories,
        errors: [],
      });
    } catch (e: any) {
      await this.eventsService.insert('CATEGORIES', 'ERROR', e.message ?? '');
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }
}
