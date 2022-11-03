import { CheckIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Grid, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout, { siteTitle } from '../components/layout';
import StepLayout from '../components/StepLayout';

const Serving = ({
  disabled = false,
  title,
  bulletPoints,
  onClick,
}: {
  disabled?: boolean;
  title: string;
  bulletPoints: Array<string>;
  onClick: any;
}) => {
  return (
    <Box
      p={'1rem 1.5rem'}
      border={'solid #CCCCCC 1px'}
      opacity={disabled ? 0.5 : 1}
    >
      <Text
        fontSize={{ base: '1rem', md: '1.2rem' }}
        color="gray.dark"
        fontWeight={600}
        mb={'1rem'}
      >
        {title}
      </Text>
      <Text mb={'0.5rem'} fontSize={'1rem'} color="gray.dark">
        Suitable for:
      </Text>
      {bulletPoints.map((bulletPoint) => {
        return (
          <Flex mb={'0.5rem'} alignItems={'start'} key={bulletPoint}>
            <Box>
              <CheckIcon mr={'0.5rem'} color={'brand.500'} />
            </Box>
            <Text
              mb={'0.5rem'}
              fontSize={'1rem'}
              color="gray.dark"
              fontWeight={500}
            >
              {bulletPoint}
            </Text>
          </Flex>
        );
      })}

      <Flex justifyContent={'center'}>
        <Button
          mt={4}
          colorScheme="brand"
          w={'100%'}
          fontSize={{ base: '0.9rem', md: '1.1rem' }}
          fontWeight={600}
          padding={'1.5rem 1rem'}
          onClick={onClick}
          disabled={disabled}
        >
          Choose {title}
        </Button>
      </Flex>
    </Box>
  );
};

const Servings: NextPage = () => {
  const router = useRouter();

  const onNavigate = (pathname: string, query: any) => {
    router.push({ pathname, query });
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
            Step 3 of 3
          </Text>
          <Text
            fontSize={{ base: '1.25rem', md: '1.5rem' }}
            color="gray.dark"
            fontWeight={600}
            mb={'4rem'}
          >
            Choose servings per recipe
          </Text>

          <Grid
            templateColumns="repeat(auto-fill, minMax(250px,1fr));"
            gridAutoRows={'minMax(210px,1fr)'}
            gap={4}
            justifyContent={'space-between'}
          >
            <Serving
              disabled={true}
              title={'Regular'}
              bulletPoints={['2 servings per recipe']}
              onClick={() =>
                onNavigate('/about-menu', {
                  ...router.query,
                  servings: '2',
                })
              }
            />
            <Serving
              title={'Large'}
              bulletPoints={['4 servings per recipe']}
              onClick={() =>
                onNavigate('/about-menu', { ...router.query, servings: '4' })
              }
            />
          </Grid>
        </Box>
      </StepLayout>
    </Layout>
  );
};

export default Servings;
