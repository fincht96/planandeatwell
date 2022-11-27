// import { initializeApp } from 'firebase/app';

import admin from 'firebase-admin';
import serviceAccount from './configs/firebase-admin.json';

export const initFirebaseAdmin = () => {
  return admin.initializeApp({
    credential: admin.credential.cert(<admin.ServiceAccount>serviceAccount),
  });
};
