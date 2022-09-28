import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express, { Request, Response } from 'express';
import routes from './routes';
import { AwilixContainer } from 'awilix';
import AppConfig from './configs/app.config';
import helmet from 'helmet';

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
      'https://planandeatwell.uk'
    ];

    const app = express();
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(
      cors({
        origin: whitelist
      })
    );
    app.use(helmet());

    app.use((req: Request, res: Response, next) => {
      // We want a new scope for each request!
      req.container = container.createScope();
      return next();
    });

    app.use('/', routes);

    return app;
  }
}
