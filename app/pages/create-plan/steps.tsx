import { Box, Button, Flex, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout, { siteTitle } from '../../components/layout';
import StepLayout from '../../components/StepLayout';
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

      <StepLayout>
        <Box p={'3rem 1rem'}>
          <Text
            fontSize={{ base: '1.25rem', md: '1.5rem' }}
            color="gray.dark"
            fontWeight={600}
            mb={'1rem'}
          >
            Your meal plan is just a few steps away...
          </Text>

          <Flex justifyContent={'center'} flexDirection={'column'}>
            <Box mb={'2rem'} maxW={'30rem'}>
              <Text>
                1. choose recipes for your meal plan based on supermarket, price
                per serving, dietry requirements and more
              </Text>
            </Box>
            <Box mb={'2rem'} maxW={'30rem'}>
              <Text>
                2. we then make a meal plan based of the recipes you chosen. we
                should you the ingredients you need. You can sort ingredients.
                We also tell you exactly how much it cost
              </Text>
            </Box>
            <Box mb={'2rem'} maxW={'30rem'}>
              <Text>
                3. Head to the shops with our the list of ingredients. then
                follow our recipes instructions to make the recipe at home.
              </Text>
            </Box>
            <Box mb={'2rem'} maxW={'30rem'}>
              <Text>
                4. refer back to your created meal plan whenever you need. You
                can create multiple meal plan depending on your goals.
              </Text>
            </Box>
            <Box mb={'2rem'} maxW={'30rem'}>
              <Text>
                tip: share your meal plan with friends to help them save money
                and time
              </Text>
            </Box>
          </Flex>

          <Flex justifyContent={'center'}>
            <Button
              mt={4}
              colorScheme="brand"
              w="15rem"
              fontSize={{ base: '1.2rem', md: '1.5rem' }}
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

Steps.requireAuth = true;

export default Steps;
