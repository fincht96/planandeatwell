import {
  asClass,
  InjectionMode,
  createContainer,
  AwilixContainer,
  Lifetime,
  asFunction
} from 'awilix';

import App from './app';
import AppConfig from './configs/app.config';
import { makeDbConnection } from './db';

export default class Bootstrap {
  private instance: AwilixContainer;

  constructor() {
    this.instance = this._createContainer();
  }

  async run(callback: any) {
    const environment = this.instance.resolve('appConfig').environment;

    if (environment === 'development') {
      await this.instance.resolve('db').migrate.latest();
    }

    const app = this.instance.resolve('app');
    app.start(this.instance, callback);
  }

  _createContainer() {
    const container = createContainer({ injectionMode: InjectionMode.CLASSIC });

    container.register({
      appConfig: asClass(AppConfig).singleton(),
      app: asClass(App).singleton(),
      db: asFunction(makeDbConnection).singleton()
    });

    container.loadModules(
      ['src/app/services/*.ts', 'src/app/controllers/*.ts'],
      {
        formatName: 'camelCase',
        resolverOptions: {
          // We want instances to be scoped to the Express request.
          // We need to set that up.
          lifetime: Lifetime.SCOPED
        }
      }
    );

    return container;
  }
}
