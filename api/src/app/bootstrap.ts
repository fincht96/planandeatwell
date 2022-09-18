import {
  asClass,
  InjectionMode,
  createContainer,
  AwilixContainer,
  Lifetime
} from 'awilix';

import App from './app';
import AppConfig from './configs/app.config';
// import HeroesRepository from './routes/heroes/heroes.repository';
import { TodosService } from './services/todos_service';

export default class Bootstrap {
  private instance: AwilixContainer;

  constructor() {
    this.instance = this._createContainer();
  }

  run(callback: any) {
    const app = this.instance.resolve('app');
    app.start(this.instance, callback);
  }

  _createContainer() {
    const container = createContainer({ injectionMode: InjectionMode.CLASSIC });

    container.register({
      app: asClass(App).singleton(),
      appConfig: asClass(AppConfig).singleton(),
      todosService: asClass(TodosService).scoped()
    });

    // The `TodosService` lives in services/TodosService
    container.loadModules(['services/*.ts'], {
      // we want `TodosService` to be registered as `todosService`.
      formatName: 'camelCase',
      resolverOptions: {
        // We want instances to be scoped to the Express request.
        // We need to set that up.
        lifetime: Lifetime.SCOPED
      }
    });

    // The `TodosService` lives in services/TodosService
    container.loadModules(['controllers/*.ts'], {
      // we want `TodosService` to be registered as `todosService`.
      formatName: 'camelCase',
      resolverOptions: {
        // We want instances to be scoped to the Express request.
        // We need to set that up.
        lifetime: Lifetime.SCOPED
      }
    });

    return container;
  }
}
