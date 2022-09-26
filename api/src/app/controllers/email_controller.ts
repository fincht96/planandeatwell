import { Request, Response } from 'express';
import EmailService from '../services/email_service';
import validator from 'validator';

export default class EmailController {
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    this.emailService = emailService;
  }

  async registerCustomerEmail(req: Request, res: Response) {
    const email = req.body.email;

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        errors: ['invalid email provided']
      });
    }

    const found = await this.emailService.findOne(email);

    if (found.error) {
      return res.status(500).json({
        errors: [`error storing email, ${email}`]
      });
    }

    if (found.result) {
      return res.status(200).json({
        errors: ['email already registered']
      });
    }

    const inserted = await this.emailService.insertEmail(email);

    if (inserted.error) {
      return res.status(500).json({
        errors: ['error inserting email']
      });
    }

    return res.status(200).json({
      errors: []
    });
  }
}
