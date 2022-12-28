import { Unsubscribe, User } from 'firebase/auth';
import auth from './firebase';

import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Event, Subscriber } from './types/eventBus.types';

import { syncClaims } from './utils/requests/user';

export default class Auth {
  private firebaseUnsubscribe: Unsubscribe;
  private initialised: boolean = false;
  private user: User | null = null;
  private subscribers: Array<Subscriber> = [];

  private currentState: 'signedIn' | 'signedOut' = 'signedOut';

  constructor() {
    this.firebaseUnsubscribe = auth.onIdTokenChanged(this._onIdTokenChanged);
  }

  destructor() {
    this.firebaseUnsubscribe();
  }

  private _notify = (event: Event) => {
    this.subscribers.forEach((subscriber) => {
      subscriber.notify(event);
    });
  };

  private _onIdTokenChanged = (user: User | null) => {
    this.user = user;

    // initialise auth
    if (!this.initialised) {
      this.initialised = true;
      this._notify({ name: 'onInit', data: '' });
    }

    // user signed in
    if (this.currentState !== 'signedIn' && this.user) {
      this.currentState = 'signedIn';
      this._notify({ name: 'onSignIn', data: '' });
    }

    // user signed out
    if (this.currentState !== 'signedOut' && !this.user) {
      this.currentState = 'signedOut';
      this._notify({ name: 'onSignOut', data: '' });
    }
  };

  async signIn(email: string, password: string) {
    // unsubscribe firebase listener
    this.firebaseUnsubscribe();
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        // grab firebase id token
        return userCredentials.user.getIdToken();
      })
      .then((idToken) => {
        // sync firebase id token claims with db
        return syncClaims({ accessToken: idToken });
      })
      .then(() => {
        // refresh firebase id token with new claims
        return auth.currentUser?.getIdTokenResult(true);
      })
      .then(() => {
        // auth sign in
        this.currentState = 'signedIn';
        this.user = auth.currentUser;
        this._notify({ name: 'onSignIn', data: '' });
        return this.user;
      })
      .catch((error: Error) => {
        this.user = null;
        this._notify({ name: 'onError', data: error.message });
        throw error;
      })
      .finally(() => {
        // resubscribe firebase listener
        this.firebaseUnsubscribe = auth.onIdTokenChanged(
          this._onIdTokenChanged,
        );
      });
  }

  async signOut() {
    return signOut(auth).catch((error: Error) => {
      this._notify({ name: 'onError', data: error.message });
      throw error;
    });
  }

  getUser() {
    return this.user;
  }

  subscribe = (subscriber: Subscriber) => {
    this.subscribers = [...this.subscribers, subscriber];
  };

  unsubscribe = (subscriber: Subscriber) => {
    this.subscribers = this.subscribers.filter(
      (currentSubscriber) => currentSubscriber !== subscriber,
    );
  };
}
