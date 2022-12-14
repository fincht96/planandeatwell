import {
  asClass,
  InjectionMode,
  createContainer,
  AwilixContainer,
  Lifetime,
  listModules,
  asFunction,
} from 'awilix';

import App from './app';
import AppConfig from './configs/app.config';
import { makeDbConnection } from './db';
import { initFirebaseAdmin } from './firebase_admin';
import Mailer from './mailer';

export default class Bootstrap {
  private instance: AwilixContainer;

  constructor() {
    this.instance = this._createContainer();
  }

  async run(callback: any) {
    try {
      // const environment = this.instance.resolve('appConfig').environment;
      // if (environment === 'development') {
      //   await this.instance.resolve('db').migrate.latest();
      // }

      await this.instance.resolve('mailer').init();

      const app = this.instance.resolve('app');
      app.start(this.instance, callback);
    } catch (e) {
      console.log('bootstrap run error: ', e);
    }
  }

  _createContainer() {
    const container = createContainer({ injectionMode: InjectionMode.CLASSIC });

    container.register({
      appConfig: asClass(AppConfig).singleton(),
      app: asClass(App).singleton(),
      db: asFunction(makeDbConnection).singleton(),
      mailer: asClass(Mailer).singleton(),
      firebaseAdmin: asFunction(initFirebaseAdmin).singleton(),
    });

    // console.log(
    //   'container',
    //   listModules([`./services/*.{ts,js}`, `./controllers/*.{ts,js}`], {
    //     cwd: __dirname
    //   })
    // );

    const modules = listModules(
      [
        `./services/*.{ts,js}`,
        `./controllers/*.{ts,js}`,
        `./middleware/*.{ts,js}`,
      ],
      {
        cwd: __dirname,
      },
    );

    container.loadModules(
      modules.map((el) => el.path),
      // [
      //   // `${process.cwd()}/src/app/services/*.ts`
      //   // `src/app/controllers/*.ts`

      // ],
      {
        formatName: 'camelCase',
        resolverOptions: {
          // We want instances to be scoped to the Express request.
          // We need to set that up.
          lifetime: Lifetime.SCOPED,
        },
      },
    );

    return container;
  }
}
