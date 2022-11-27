import { signInWithEmailAndPassword, User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import auth from '../firebase';
import { syncClaims } from '../utils/requests/user';

const AuthContext = createContext<{
  idToken: string | null | undefined;
  currentUser: User | null | undefined;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  authLoading: boolean;
} | null>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [idToken, setIdToken] = useState<string | null | undefined>();
  const [loading, setLoading] = useState(true);
  const [claimsSynced, setClaimsSynced] = useState(true);

  const login = async (email: string, password: string) => {
    setClaimsSynced(false);

    // sign in with firebase
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // get id token
    const fbIdToken = await userCredentials.user.getIdToken();

    // syncs firebase claims with those in db
    await syncClaims({ accessToken: fbIdToken });

    setClaimsSynced(true);

    return auth.currentUser?.getIdTokenResult(true);
  };

  const logout = async () => {
    return auth.signOut();
  };

  // on id token changed (refresh, sign in/out), update user and id token
  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (user: User | null) => {
      const newIdToken = await auth.currentUser?.getIdToken();
      setIdToken(newIdToken);

      if (claimsSynced) {
        setCurrentUser(user);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [claimsSynced]);

  const value = {
    idToken,
    currentUser,
    login,
    logout,
    authLoading: loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
