import admin from 'firebase-admin';
import AppConfig from './configs/app.config';

export const initFirebaseAdmin = (appConfig: AppConfig) => {
  const stringifiedJSON = Buffer.from(
    appConfig.firebaseServiceAccount,
    'base64',
  ).toString('utf8');
  const serviceAccount = JSON.parse(stringifiedJSON);

  return admin.initializeApp({
    credential: admin.credential.cert(<admin.ServiceAccount>serviceAccount),
  });
};
