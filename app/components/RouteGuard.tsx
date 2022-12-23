import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/auth-context';

export function RouteGuard({
  children,
  isProtectedComponent,
}: {
  children: JSX.Element;
  isProtectedComponent: boolean;
}) {
  const { user, initialized, redirectPath, setRedirectPath } = useAuth();
  const router = useRouter();

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
      /* if authenticated user attempts to access public route, redirect to protected route */
      if (user && !isProtectedComponent) {
        router.push(redirectPath.length ? redirectPath : '/create-plan/steps');
      }
    }
  }, [initialized, isProtectedComponent, redirectPath, router, user]);

  /* show loading indicator while the auth provider is still initializing */
  if (!initialized) {
    return <></>;
  }

  if (initialized) {
    /* not a valid user, show public page */
    if (!user && !isProtectedComponent) {
      return <>{children}</>;
    }

    /* a valid user, show protected page */
    if (user && isProtectedComponent) {
      return <>{children}</>;
    }
  }

  /* otherwise don't return anything, will do a redirect from useEffect */
  return null;
}
