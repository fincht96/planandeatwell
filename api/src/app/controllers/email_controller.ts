import { Request, Response } from 'express';
import EmailService from '../services/email_service';
import validator from 'validator';
import Mailer from '../mailer';
import registerInterestEmailTemplate from '../email_templates/thankyou_for_registering_interest';

export default class EmailController {
  private emailService: EmailService;
  private mailer: Mailer;

  constructor(emailService: EmailService, mailer: Mailer) {
    this.emailService = emailService;
    this.mailer = mailer;
  }

  async registerCustomerEmail(req: Request, res: Response) {
    const email = req.body.email.toLowerCase();

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        errors: ['invalid email provided']
      });
    }

    const found = await this.emailService.findOne(email);

    if (found.error) {
      return res.status(500).json({
        errors: [`error unable to store email, ${email}`]
      });
    }

    if (found.result) {
      return res.status(200).json({
        errors: ['email has already been registered']
      });
    }

    const inserted = await this.emailService.insertEmail(email);

    if (inserted.error) {
      return res.status(500).json({
        errors: ['error unable to store email']
      });
    }

    const { from, subject, txt, html, attachments } =
      registerInterestEmailTemplate;

    this.mailer.sendMail(from, email, subject, txt, html, attachments);

    return res.status(200).json({
      errors: []
    });
  }
}
