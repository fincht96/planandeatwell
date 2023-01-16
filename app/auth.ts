import {
  IdTokenResult,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  Unsubscribe,
  User,
} from 'firebase/auth';
import auth from './firebase';
import { Event, Subscriber } from './types/eventBus.types';
import { syncClaims } from './utils/requests/user';

class Auth {
  private firebaseUnsubscribe: Unsubscribe | null = null;
  private initialised: boolean = false;
  private user: User | null = null;
  private idTokenResult: IdTokenResult | undefined = undefined;
  private idToken: string | undefined = undefined;
  private subscribers: Array<Subscriber> = [];
  private currentState: 'signedIn' | 'signedOut' = 'signedOut';
  private busy: boolean = false;

  private _notify = (event: Event) => {
    this.subscribers.forEach((subscriber) => {
      subscriber.notify(event);
    });
  };

  private _onIdTokenChanged = (user: User | null) => {
    if (!this.busy) {
      // sign in user
      if (this.currentState !== 'signedIn' && user) {
        this.busy = true;

        user
          .getIdToken()
          .then((accessToken) => {
            // sync claims with planandeatwell db
            return syncClaims({ accessToken });
          })
          .then(() => {
            // update fb access token claims
            return auth.currentUser?.getIdToken(true);
          })
          .then(() => {
            return Promise.all([
              auth.currentUser?.getIdToken(),
              auth.currentUser?.getIdTokenResult(),
            ]);
          })
          .then((values) => {
            this.user = auth.currentUser;
            this.idToken = values[0];
            this.idTokenResult = values[1];
            this.currentState = 'signedIn';
            this._notify({ name: 'onSignIn', data: '' });
          })
          .catch(() => {
            this._notify({ name: 'onError', data: 'Sign in error occurred' });
          })
          .finally(() => {
            // if not initialised, initialise now
            if (!this.initialised) {
              this.initialised = true;
              this._notify({ name: 'onInit', data: '' });
            }
            this.busy = false;
          });
      }

      // sign out user
      if (this.currentState !== 'signedOut' && !user) {
        this.currentState = 'signedOut';
        this.idTokenResult = undefined;
        this.idToken = undefined;
        this.user = null;
        this._notify({ name: 'onSignOut', data: '' });
      }

      // initialise auth, no fb user currently signed in
      if (!this.initialised && !user) {
        this.initialised = true;
        this._notify({ name: 'onInit', data: '' });
      }
    }
  };

  async signIn(email: string, password: string) {
    signInWithEmailAndPassword(auth, email, password).catch(() => {
      this._notify({ name: 'onError', data: 'Firebase sign in error' });
    });
  }

  async signOut() {
    signOut(auth).catch(() => {
      this._notify({ name: 'onError', data: 'Firebase sign out error' });
    });
  }

  async sendPasswordResetEmail(userEmail: string) {
    sendPasswordResetEmail(auth, userEmail)
      .then(() => {
        this._notify({ name: 'onPasswordResetEmailSent', data: '' });
      })
      .catch(() => {
        this._notify({
          name: 'onError',
          data: 'Error sending password reset email',
        });
      });
  }

  init() {
    if (!this.firebaseUnsubscribe) {
      this.firebaseUnsubscribe = auth.onIdTokenChanged(this._onIdTokenChanged);
    }
  }

  terminate() {
    if (this.firebaseUnsubscribe) {
      this.firebaseUnsubscribe();
      this.firebaseUnsubscribe = null;
    }
  }

  getUser() {
    return this.user;
  }

  getIdToken() {
    return this.idToken ?? '';
  }

  getIdTokenResult() {
    return this.idTokenResult ?? null;
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

export default Auth;
