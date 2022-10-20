import { Request, Response } from 'express';
import EmailService from '../services/email_service';
import validator from 'validator';
import Mailer from '../mailer';
import registerInterestEmailTemplate from '../email_templates/thankyou_for_registering_interest';
import EventsService from '../services/events_service';

export default class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly mailer: Mailer,
    private readonly eventsService: EventsService,
  ) {
    this.emailService = emailService;
    this.mailer = mailer;
  }

  async registerCustomerEmail(req: Request, res: Response) {
    const email = req.body.email.toLowerCase();

    try {
      if (!validator.isEmail(email)) {
        throw new Error('Invalid email provided');
      }

      const { error } = await this.emailService.insertEmail(email);
      if (error) {
        throw new Error(`Email already registered, ${email}`);
      }

      const { from, subject, txt, html, attachments } =
        registerInterestEmailTemplate;

      await this.mailer.sendMail(from, email, subject, txt, html, attachments);

      await this.eventsService.insert(
        'REGISTER_EMAIL',
        'SUCCESS',
        `Email, ${email} successfully registered`,
      );

      return res.status(200).json({
        errors: [],
      });
    } catch (e: any) {
      await this.eventsService.insert(
        'REGISTER_EMAIL',
        'ERROR',
        e.message ?? '',
      );
      return res.status(400).json({
        errors: [e?.message],
      });
    }
  }
}
