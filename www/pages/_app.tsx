import Script from 'next/script';
import type { AppProps } from 'next/app';
import theme from '../theme';
import { useRouter } from 'next/router';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import CookieConsent, { getCookieConsentValue } from 'react-cookie-consent';
import { GA_TRACKING_ID, pageview } from '../lib/gtag';
import ChakraNextLink from '../components/NextChakraLink';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Fonts from '../Fonts';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [cookiesConsent, setCookiesConsent] = useState<boolean>(
    getCookieConsentValue() === 'true',
  );

  useEffect(() => {
    const handleRouteChange = (url: URL, { shallow }: { shallow: boolean }) => {
      pageview(url);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  const onCookieConsent = () => {
    setCookiesConsent(true);
  };

  return (
    <>
      {process.env.NEXT_PUBLIC_ENV === 'production' && cookiesConsent && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_TRACKING_ID}');
        `}
          </Script>
        </>
      )}
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Fonts />
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>

      <CookieConsent
        style={{ background: '#808080' }}
        buttonStyle={{ background: '#39C698', color: 'white' }}
        onAccept={onCookieConsent}
      >
        This website uses cookies to enhance the user experience. For further
        information please refer to the&nbsp;
        <ChakraNextLink display={'inline'} href="/privacy">
          Privacy Policy
        </ChakraNextLink>
        &nbsp;and&nbsp;
        <ChakraNextLink display={'inline'} href="/terms-and-conditions">
          Terms and Conditions
        </ChakraNextLink>
      </CookieConsent>
    </>
  );
}

export default MyApp;
