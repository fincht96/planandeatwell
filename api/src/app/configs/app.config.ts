export default class AppConfig {
  environment: 'development' | 'production';
  port: string;
  mailHost: string;
  mailPort: number;
  mailUser: string;
  mailPass: string;

  constructor() {
    this.environment = process.env.NODE_ENV;
    this.port = process.env.PORT;
    this.mailHost = process.env.MAIL_HOST;
    this.mailUser = process.env.MAIL_USER;
    this.mailPass = process.env.MAIL_PASS;
    this.mailPort = Number(process.env.MAIL_PORT);
  }
}
