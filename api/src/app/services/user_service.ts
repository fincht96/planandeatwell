import { Knex } from 'knex';
// @ts-ignore
import camelize from 'camelize';
import admin from 'firebase-admin';

export default class UserService {
  private db: Knex;
  constructor(db: Knex, private readonly firebaseAdmin: admin.app.App) {
    this.db = db;
  }

  async updateFirebaseIdTokenClaims(idToken: string) {
    let user: {
      roles: Array<string>;
      id: string;
    } | null = null;

    // decode token
    const decodedId = await this.firebaseAdmin.auth().verifyIdToken(idToken);

    // lookup user in db with accessToken id
    const results = await this.db('users')
      .select('*')
      .where('uid', decodedId.uid);

    if (results.length) {
      // found existing user
      user = results[0];
    } else {
      // no user found
      throw new Error('No user account found');
    }
    // update the id token claims
    await this.firebaseAdmin.auth().setCustomUserClaims(decodedId.uid, {
      roles: user?.roles,
      planandeatwell_id: user?.id,
    });

    return camelize(user);
  }

  async createAccount(account: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const { firstName, lastName, email, password } = account;

    // create a new user in app db
    const result = await this.db('users').insert(
      {
        roles: ['user'],
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
      },
      ['*'],
    );

    const firebase_uid = result[0].uid;
    const planandeatwell_id = result[0].id;

    // lookup user
    const user = await this.firebaseAdmin
      .auth()
      .getUserByEmail(email)
      .then((userRecord) => userRecord)
      .catch(() => null);

    // if user exists on firebase, delete existing firebase user
    if (user) {
      await this.firebaseAdmin.auth().deleteUser(user.uid);
    }

    // create a firebase account
    await this.firebaseAdmin.auth().createUser({
      uid: firebase_uid,
      email,
      emailVerified: false,
      password,
      displayName: `${firstName} ${lastName}`,
      disabled: false,
    });

    // update the id token claims
    await this.firebaseAdmin.auth().setCustomUserClaims(firebase_uid, {
      roles: 'user',
      planandeatwell_id,
    });

    return result[0];
  }
}
