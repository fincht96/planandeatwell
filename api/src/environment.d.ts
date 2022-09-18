import { AwilixContainer } from 'awilix';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
    }
  }

  namespace Express {
    interface Request {
      container: AwilixContainer;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
