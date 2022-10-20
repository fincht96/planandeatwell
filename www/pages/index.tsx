import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import { Divider } from '@chakra-ui/react';
import Hero from '../components/sections/Hero';
import WhatIsIt from '../components/sections/WhatIsIt';
import HowItWorks from '../components/sections/HowItWorks';
import Result from '../components/sections/Result';
import Contact from '../components/sections/Contact';

export default function Home() {
  return (
    <>
      <Layout>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <Hero />
        <WhatIsIt />
        <Divider orientation="horizontal" colorScheme="gray" />
        <HowItWorks />
        <Divider orientation="horizontal" colorScheme="gray" />
        <Result />
        <Contact />
      </Layout>
    </>
  );
}
