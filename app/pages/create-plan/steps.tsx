import { Box, Button, Container, Flex, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout, { siteTitle } from '../../components/layout';
import { CustomNextPage } from '../../types/CustomNextPage';

const Steps: CustomNextPage = () => {
  const router = useRouter();

  const onNavigate = (pathname: string) => {
    router.push(pathname);
  };

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <Container maxH="1000px" maxW="800px" padding="0 2rem 2.5rem">
        <Box>
          <Text
            mb="2rem"
            fontSize={{ base: '1.4rem', sm: '1.7rem', md: '2rem' }}
            color="black"
            fontWeight={600}
            textAlign={{ base: 'center', lg: 'left' }}
          >
            Your meal plan is just a few steps away...
          </Text>

          <Flex justifyContent={'center'} flexDirection={'column'}>
            <Box
              mb={'1.5rem'}
              maxW={'50rem'}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <Box
                mr="1rem"
                p={1}
                borderRadius="9999px"
                height="2rem"
                width="100%"
                maxWidth="2rem"
                background="brand.500"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="1.2rem" color="white" fontWeight="600">
                  1
                </Text>
              </Box>
              <Box>
                <Text
                  color={'gray.dark'}
                  fontWeight={'600'}
                  letterSpacing={'wide'}
                  fontSize="1rem"
                >
                  Select supermarket
                </Text>
              </Box>
            </Box>
            <Box
              mb={'1.5rem'}
              maxW={'50rem'}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <Box
                mr="1rem"
                p={1}
                borderRadius="9999px"
                height="2rem"
                width="100%"
                maxWidth="2rem"
                background="brand.500"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="1.2rem" color="white" fontWeight="600">
                  2
                </Text>
              </Box>
              <Box>
                <Text
                  color={'gray.dark'}
                  fontWeight={'600'}
                  letterSpacing={'wide'}
                  fontSize="1rem"
                >
                  Choose recipes made with supermarket ingredients
                </Text>
              </Box>
            </Box>
            <Box
              mb={'1.5rem'}
              maxW={'50rem'}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <Box
                mr="1rem"
                p={1}
                borderRadius="9999px"
                height="2rem"
                width="100%"
                maxWidth="2rem"
                background="brand.500"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="1.2rem" color="white" fontWeight="600">
                  3
                </Text>
              </Box>
              <Box>
                <Text
                  color={'gray.dark'}
                  fontWeight={'600'}
                  letterSpacing={'wide'}
                  fontSize="1rem"
                >
                  Create a meal plan
                </Text>
              </Box>
            </Box>
            <Box
              mb={'1.5rem'}
              maxW={'50rem'}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <Box
                mr="1rem"
                p={1}
                borderRadius="9999px"
                height="2rem"
                width="100%"
                maxWidth="2rem"
                background="brand.500"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="1.2rem" color="white" fontWeight="600">
                  4
                </Text>
              </Box>
              <Box>
                <Text
                  color={'gray.dark'}
                  fontWeight={'600'}
                  letterSpacing={'wide'}
                  fontSize="1rem"
                >
                  Shop using meal plan ingredients
                </Text>
              </Box>
            </Box>
            <Box
              mb={'2rem'}
              maxW={'50rem'}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <Box
                mr="1rem"
                p={1}
                borderRadius="9999px"
                height="2rem"
                width="100%"
                maxWidth="2rem"
                background="brand.500"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="1.2rem" color="white" fontWeight="600">
                  5
                </Text>
              </Box>
              <Box>
                <Text
                  color={'gray.dark'}
                  fontWeight={'600'}
                  letterSpacing={'wide'}
                  fontSize="1rem"
                >
                  Do your cooking using instructions provided in meal plan
                </Text>
              </Box>
            </Box>
          </Flex>

          <Flex justifyContent={'center'} mt="1rem">
            <Button
              height="3.5rem"
              borderRadius="lg"
              colorScheme="brand"
              w="10rem"
              _hover={{
                bg: 'brand.100',
                color: 'black',
              }}
              fontSize="1.2rem"
              fontWeight={600}
              onClick={() => onNavigate('/supermarket')}
            >
              Start
            </Button>
          </Flex>
        </Box>
      </Container>
    </Layout>
  );
};

Steps.requireAuth = true;

export default Steps;
