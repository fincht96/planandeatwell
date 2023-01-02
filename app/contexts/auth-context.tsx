import { User } from 'firebase/auth';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import Auth from '../auth';
import { AuthClaims } from '../types/AuthClaims';
import { Event, Subscriber } from '../types/eventBus.types';
import { idTokenResultToAuthClaims } from '../utils/idTokenResultToAuthClaims';

export const AuthContext = createContext<{
  authToken: string;
  authClaims: AuthClaims | null;
  user: User | null;
  signIn: ((email: string, password: string) => void) | null;
  signOut: (() => void) | null;
  initialized: boolean;
  redirectPath: string;
  setRedirectPath: Dispatch<SetStateAction<string>> | null;
  subscribe: ((subscriber: Subscriber) => void) | null;
  unsubscribe: ((subscriber: Subscriber) => void) | null;
}>({
  authToken: '',
  authClaims: null,
  user: null,
  signIn: null,
  signOut: null,
  initialized: false,
  redirectPath: '',
  setRedirectPath: null,
  subscribe: null,
  unsubscribe: null,
});

AuthContext.displayName = 'AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [auth] = useState(new Auth());
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string>('');
  const [authClaims, setAuthClaims] = useState<AuthClaims | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    const authSubscriber = {
      notify(event: Event) {
        if (event.name === 'onSignIn') {
          setUser(auth.getUser());
          setAuthToken(auth.getIdToken());
          setAuthClaims(idTokenResultToAuthClaims(auth.getIdTokenResult()));
        }

        if (event.name === 'onSignOut') {
          setUser(null);
          setAuthToken('');
          setAuthClaims(null);
        }

        if (event.name === 'onInit') {
          setInitialized(true);
        }
      },
    };

    auth.subscribe(authSubscriber);
    auth.init();

    return () => {
      auth.unsubscribe(authSubscriber);
      auth.terminate();
    };
  }, [auth]);

  const signIn = (email: string, password: string) => {
    return auth.signIn(email, password);
  };

  const signOut = () => {
    return auth.signOut();
  };

  const value = {
    authToken,
    authClaims,
    initialized,
    user,
    signIn,
    signOut,
    redirectPath,
    setRedirectPath,
    subscribe: auth.subscribe,
    unsubscribe: auth.unsubscribe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
