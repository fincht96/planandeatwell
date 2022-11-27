import { Request, Response } from 'express';
import EventsService from '../services/events_service';
import Joi from 'joi';
import UserService from '../services/user_service';

const syncClaimsSchema = Joi.object({
  accessToken: Joi.string().required(),
});

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
}
