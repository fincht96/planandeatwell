import AppConfig from './configs/app.config';
import nodemailer, { Transporter } from 'nodemailer';

export default class Mailer {
  private appConfig: AppConfig;
  private transporter?: Transporter;

  constructor(appConfig: AppConfig) {
    this.appConfig = appConfig;
  }

  async init() {
    let options = {
      host: this.appConfig.mailHost,
      secure: true,
      port: 465,
      auth: {
        user: this.appConfig.mailUser,
        pass: this.appConfig.mailPass,
      },
    };

    if (this.appConfig.environment === 'development') {
      const testAccount = await nodemailer.createTestAccount();
      options = {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      };
    }

    this.transporter = nodemailer.createTransport(options);
    console.log('this.transporter ', await this.transporter.verify());
  }

  async sendMail(
    from: string,
    to: string,
    subject: string,
    text: string,
    html: string,
    attachments?: Array<{ filename: string; path: string; cid: string }>,
  ) {
    const info = await this.transporter?.sendMail({
      from, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
      attachments,
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    if (this.appConfig.environment === 'development') {
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return info;
  }
}
