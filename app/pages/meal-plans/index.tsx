import { Box, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import StepLayout from '../../components/StepLayout';

import { CustomNextPage } from '../../types/CustomNextPage';

const MealPlans: CustomNextPage = () => {
  const router = useRouter();

  return (
    <Layout>
      <Head>
        <title>Meal Plans | Plan and Eat Well</title>
      </Head>

      <StepLayout>
        <Box p={'3rem 1rem'}>
          <Text
            fontSize={{ base: '0.8rem', md: '1rem' }}
            color="gray.normal"
            fontWeight={400}
          >
            Meal plans
          </Text>
        </Box>
      </StepLayout>
    </Layout>
  );
};

MealPlans.requireAuth = true;

export default MealPlans;
