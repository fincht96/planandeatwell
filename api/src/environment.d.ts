import { AwilixContainer } from 'awilix';
import { auth } from 'firebase-admin';

// global scope, overrides specific namespaces
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT: string;
      MAIL_HOST: string;
      MAIL_PORT: string;
      MAIL_USER: string;
      MAIL_PASS: string;
      SPACES_KEY: string;
      SPACES_SECRET: string;
      SPACES_ENDPOINT: string;
      SPACES_REGION: string;
      SPACES_BUCKET: string;
      CDN_ENDPOINT: string;
      FIREBASE_SERVICE_ACCOUNT: string;
    }
  }

  namespace Express {
    interface Request {
      container: AwilixContainer;
      user: auth.DecodedIdToken;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
