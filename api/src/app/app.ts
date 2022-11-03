import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express, { Request, Response } from 'express';
import routes from './routes';
import { AwilixContainer } from 'awilix';
import AppConfig from './configs/app.config';
import helmet from 'helmet';
import slowDown from 'express-slow-down';

export default class App {
  appConfig: any;

  constructor(appConfig: AppConfig) {
    this.appConfig = appConfig;
  }

  start(container: AwilixContainer, callback: any) {
    const app = this._create(container);
    const port = this.appConfig.port;

    app.listen(port, callback(port));
  }

  _create(container: AwilixContainer) {
    const whitelist = [
      'http://planandeatwell.localhost',
      'https://planandeatwell.uk',
      'http://app.planandeatwell.localhost',
      'https://app.planandeatwell.uk',
    ];

    const app = express();
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(
      cors({
        origin: whitelist,
      }),
    );
    app.use(helmet());
    // running on dokku which uses dokku proxy
    app.enable('trust proxy');

    // enable preflight requests across all endpoints
    app.options('*', cors());

    const speedLimiter = slowDown({
      windowMs: 15 * 60 * 1000, // 15 minutes
      delayAfter: 100, // allow 100 requests per 15 minutes, then...
      delayMs: 500, // begin adding 500ms of delay per request above 100:
      // request # 101 is delayed by  500ms
      // request # 102 is delayed by 1000ms
      // request # 103 is delayed by 1500ms
      // etc.
    });

    //  apply to all requests
    app.use(speedLimiter);
    app.use((req: Request, res: Response, next) => {
      // We want a new scope for each request!
      req.container = container.createScope();
      return next();
    });
    app.use('/', routes);

    return app;
  }
}
