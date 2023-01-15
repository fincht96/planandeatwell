import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/auth-context';
import { Event } from '../types/eventBus.types';

// if logged in don't allow access to the sign in / sign up pages
const userInaccessibleRoutes = ['SignIn', 'SignUp', 'ResetPassword'];

export function RouteGuard({
  children,
  isProtectedComponent,
  routeName,
}: {
  children: JSX.Element;
  isProtectedComponent: boolean;
  routeName: string;
}) {
  const {
    user,
    initialized,
    redirectPath,
    setRedirectPath,
    subscribe,
    unsubscribe,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const authSubscriber = {
      notify(event: Event) {
        if (event.name === 'onSignOut') {
          // if user is current on a public route, on sign out navigate to sign in
          if (!isProtectedComponent) {
            router.push('/sign-in');
          }
        }
      },
    };

    if (subscribe) {
      subscribe(authSubscriber);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe(authSubscriber);
      }
    };
  }, [isProtectedComponent, routeName, router, subscribe, unsubscribe]);

  useEffect(() => {
    if (initialized) {
      /* if unauthenticated user attempts to access protected route, redirect to public route  */
      if (!user && isProtectedComponent) {
        /* save the protected route user attempted to access */
        if (setRedirectPath) {
          setRedirectPath(router.asPath);
        }
        router.push('/sign-in');
      }
    }
  }, [initialized, isProtectedComponent, router, setRedirectPath, user]);

  useEffect(() => {
    if (initialized) {
      /* if authenticated user attempts to access inaccessible route, redirect to protected route */
      if (user && userInaccessibleRoutes.includes(routeName)) {
        router.push(redirectPath.length ? redirectPath : '/create-plan/steps');
      }
    }
  }, [
    initialized,
    isProtectedComponent,
    redirectPath,
    routeName,
    router,
    setRedirectPath,
    user,
  ]);

  /* show loading indicator while the auth provider is still initializing */
  if (!initialized) {
    return <></>;
  }

  if (initialized) {
    /* a valid user, attempts to access inaccessible route */
    if (user && userInaccessibleRoutes.includes(routeName)) {
      return <></>;
    }

    /* a valid user, show protected page */
    if (user && isProtectedComponent) {
      return <>{children}</>;
    }

    /* not a valid user, show public page */
    if (!isProtectedComponent) {
      return <>{children}</>;
    }
  }

  /* otherwise don't return anything, will do a redirect from useEffect */
  return null;
}
