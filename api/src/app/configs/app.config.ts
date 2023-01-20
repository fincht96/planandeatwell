export default class AppConfig {
  environment: 'development' | 'production';
  port: string;
  mailHost: string;
  mailPort: number;
  mailUser: string;
  mailPass: string;
  spacesKey: string;
  spacesSecret: string;
  spacesEndpoint: string;
  spacesRegion: string;
  spacesBucket: string;
  cdnEndpoint: string;
  firebaseServiceAccount: string;

  constructor() {
    this.environment = process.env.NODE_ENV;
    this.port = process.env.PORT;
    this.mailHost = process.env.MAIL_HOST;
    this.mailUser = process.env.MAIL_USER;
    this.mailPass = process.env.MAIL_PASS;
    this.mailPort = Number(process.env.MAIL_PORT);
    this.spacesKey = process.env.SPACES_KEY;
    this.spacesSecret = process.env.SPACES_SECRET;
    this.spacesEndpoint = process.env.SPACES_ENDPOINT;
    this.spacesRegion = process.env.SPACES_REGION;
    this.spacesBucket = process.env.SPACES_BUCKET;
    this.cdnEndpoint = process.env.CDN_ENDPOINT;
    this.firebaseServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  }
}
