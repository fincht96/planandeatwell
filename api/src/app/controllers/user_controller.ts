import { Request, Response } from 'express';
import EventsService from '../services/events_service';
import Joi from 'joi';
import UserService from '../services/user_service';

const syncClaimsSchema = Joi.object({
  accessToken: Joi.string().required(),
});

const createAccountSchema = Joi.object({
  firstName: Joi.string().max(200).required(),
  lastName: Joi.string().max(200).required(),
  email: Joi.string().min(0).max(200).required(),
  password: Joi.string().max(400).required(),
}).and('firstName', 'lastName', 'email', 'password');

export default class UserController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly userService: UserService,
  ) {}

  async syncClaims(req: Request, res: Response) {
    try {
      const { error, value } = syncClaimsSchema.validate(req.body);

      if (error) {
        throw new Error(error.message);
      }

      const result = await this.userService.updateFirebaseIdTokenClaims(
        value.accessToken,
      );

      return res.status(200).json({
        result,
        errors: [],
      });
    } catch (e: any) {
      await this.eventsService.insert(
        'USER_CONTROLLER',
        'ERROR',
        e.message ?? '',
      );
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }

  async createAccount(req: Request, res: Response) {
    try {
      const { error, value } = createAccountSchema.validate(req.body);

      if (error) {
        throw new Error(error.message);
      }

      const result = await this.userService.createAccount(value);
      return res.status(200).json({
        result,
        errors: [],
      });
    } catch (e: any) {
      await this.eventsService.insert(
        'USER_CONTROLLER',
        'ERROR',
        e.message ?? '',
      );
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }
}
