export default class AppConfig {
  environment: 'development' | 'production';
  port?: string;

  constructor() {
    this.environment = process.env.NODE_ENV;
    this.port = process.env.PORT;
  }
}
