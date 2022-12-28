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
import { Event, Subscriber } from '../types/eventBus.types';

export const AuthContext = createContext<{
  user: User | null;
  signIn: ((email: string, password: string) => Promise<User | null>) | null;
  signOut: (() => Promise<void>) | null;
  initialized: boolean;
  redirectPath: string;
  setRedirectPath: Dispatch<SetStateAction<string>> | null;
  subscribe: ((subscriber: Subscriber) => void) | null;
  unsubscribe: ((subscriber: Subscriber) => void) | null;
}>({
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
  const [initialized, setInitialized] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  useEffect(() => {
    const authSubscriber = {
      notify(event: Event) {
        if (event.name === 'onSignIn') {
          setUser(auth.getUser());
        }

        if (event.name === 'onSignOut') {
          setUser(null);
        }

        if (event.name === 'onInit') {
          setInitialized(true);
        }
      },
    };

    auth.subscribe(authSubscriber);
    return () => auth.unsubscribe(authSubscriber);
  }, []);

  const signIn = (email: string, password: string) => {
    return auth.signIn(email, password);
  };

  const signOut = () => {
    return auth.signOut();
  };

  const value = {
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
