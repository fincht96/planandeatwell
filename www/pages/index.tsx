import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import Hero from '../components/sections/Hero';
import HowItWorks from '../components/sections/HowItWorks';
import Video from '../components/sections/Video';
import FAQ from '../components/sections/FAQ';

export default function Home() {
  return (
    <>
      <Layout>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <Hero />
        <Video />
        <HowItWorks />
        <FAQ />
      </Layout>
    </>
  );
}
