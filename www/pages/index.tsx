import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import Hero from '../components/sections/Hero';
import HowItWorks from '../components/sections/HowItWorks';
import Video from '../components/sections/Video';
import FAQ from '../components/sections/FAQ';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';

export default function Home() {
  const [campaignId, setCampaignId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  /**
   default campaign id = 0
   food content influencer campaign id = 1
   */

  useEffect(() => {
    if (router.isReady) {
      const id = router.query['campaignId']
        ? Number(router.query['campaignId'])
        : 0;

      setCampaignId(id);
      setIsLoading(false);
    }
  }, [router.isReady, router.query]);

  if (isLoading) {
    return (
      <>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          size="xl"
          position="fixed"
          top="0"
          left="0"
          bottom="0"
          right="0"
          margin="auto"
        />
      </>
    );
  } else {
    return (
      <>
        {campaignId === 0 && (
          <Layout campaignId={0}>
            <Head>
              <title>{siteTitle}</title>
            </Head>
            <Hero campaignId={0} />
            <Video />
            <HowItWorks campaignId={0} />
            <FAQ />
          </Layout>
        )}
        {campaignId !== 0 && (
          <Layout>
            <Head>
              <title>{siteTitle}</title>
            </Head>
            <Hero campaignId={campaignId} />
            <HowItWorks campaignId={campaignId} />
          </Layout>
        )}
      </>
    );
  }
}
