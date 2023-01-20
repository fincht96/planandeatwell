import admin from 'firebase-admin';
import AppConfig from './configs/app.config';

export const initFirebaseAdmin = (appConfig: AppConfig) => {
  const serviceAccount = JSON.parse(appConfig.firebaseServiceAccount);
  return admin.initializeApp({
    credential: admin.credential.cert(<admin.ServiceAccount>serviceAccount),
  });
};
