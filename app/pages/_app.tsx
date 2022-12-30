import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextComponentType, NextPageContext } from 'next';
import type { AppProps } from 'next/app';
import { RouteGuard } from '../components/RouteGuard';
import { AuthProvider } from '../contexts/auth-context';
import '../styles/globals.css';
import theme from '../theme';

const queryClient = new QueryClient();

function MyApp({
  Component,
  pageProps,
}: AppProps & {
  Component: NextComponentType<NextPageContext, any, any> & {
    requireAuth: boolean;
  };
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <RouteGuard
            isProtectedComponent={Component.requireAuth}
            routeName={Component.displayName ?? ''}
          >
            <Component {...pageProps} />
          </RouteGuard>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
