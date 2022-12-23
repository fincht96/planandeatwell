import { ReactNode } from 'react';
import Head from 'next/head';
import styles from '../styles/layout.module.css';
import Navbar from './navbar';
import { Container } from '@chakra-ui/react';
import Footer from './sections/Footer';
import { Box } from '@chakra-ui/react';

interface layoutArg {
  children: ReactNode;
  excludeFooter?: boolean;
}

export const siteTitle = 'Plan and Eat Well';

export default function Layout({ children, excludeFooter }: layoutArg) {
  return (
    <Box>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="A free tool for creating budgeted recipe plans from your local supermarket with meals starting from less than £0.99/pp"
        />
        <meta
          property="og:image"
          content={`https://i.ibb.co/S6K6KJ1/og-planandeatwell.png`}
        />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <header className={styles.header}>
        <Navbar />
      </header>

      <Container p={0} maxW={'100%'} w={'100%'}>
        {children}
      </Container>

      {!!excludeFooter ? null : (
        <footer>
          <Footer />
        </footer>
      )}
    </Box>
  );
}
