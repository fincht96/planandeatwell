import { Box, Button, Flex, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout, { siteTitle } from '../components/layout';
import StepLayout from '../components/StepLayout';
import stepsImg from '../public/images/steps.png';

const Steps: NextPage = () => {
  const router = useRouter();

  const onNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <StepLayout>
        <Box p={'3rem 1rem'}>
          <Text
            fontSize={{ base: '0.8rem', md: '1rem' }}
            color="gray.normal"
            fontWeight={400}
          >
            Step 1 of 3
          </Text>
          <Text
            fontSize={{ base: '1.25rem', md: '1.5rem' }}
            color="gray.dark"
            fontWeight={600}
            mb={'4rem'}
          >
            Your meal plan is just a few steps away...
          </Text>

          <Box mb={'2rem'}>
            <Image
              quality={100}
              src={stepsImg}
              alt={'plan-and-eat-well-steps'}
            />
          </Box>

          <Flex justifyContent={'center'}>
            <Button
              mt={4}
              colorScheme="brand"
              w="15rem"
              fontSize={{ base: '0.9rem', md: '1.1rem' }}
              fontWeight={600}
              padding={'1.5rem 1rem'}
              onClick={() => onNavigate('/supermarket')}
            >
              Get started
            </Button>
          </Flex>
        </Box>
      </StepLayout>
    </Layout>
  );
};

export default Steps;
