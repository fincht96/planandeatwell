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
    } | null = null;

    // decode token
    const decodedId = await this.firebaseAdmin.auth().verifyIdToken(idToken);

    // lookup user in db with accessToken id
    const results = await this.db('users')
      .select('*')
      .where('uid', decodedId.uid);

    // no user found, insert a new user
    if (!results.length) {
      const { uid, email } = decodedId;
      const result = await this.db('users').insert(
        { uid, roles: ['user'], email },
        ['*'],
      );
      user = result[0];
    }
    // found existing user
    else {
      user = results[0];
    }
    // update the id token claims
    await this.firebaseAdmin
      .auth()
      .setCustomUserClaims(decodedId.uid, { roles: user?.roles });

    return camelize(user);
  }
}
