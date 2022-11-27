import { Request, Response, NextFunction } from 'express';
import AppConfig from '../configs/app.config';
import admin from 'firebase-admin';

export default class AuthenticationMiddlware {
  constructor(
    private readonly appConfig: AppConfig,
    private readonly firebaseAdmin: admin.app.App,
  ) {}

  async isAuthenticated(
    role: string,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const token = req.headers.authorization?.split(' ')[1] ?? '';

    try {
      const decodeValue = await this.firebaseAdmin.auth().verifyIdToken(token);
      if (decodeValue.roles.includes(role)) {
        req.user = decodeValue;
        return next();
      } else {
        // unauthorized (i.e. don't have correct role)
        res.status(403).json({
          errors: ['unauthorized'],
          result: null,
        });
      }
    } catch (e) {
      // unable to login due to token expired
      res.status(401).json({
        errors: ['invalid access token'],
        result: null,
      });
    }
  }
}
