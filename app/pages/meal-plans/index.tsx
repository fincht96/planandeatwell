import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Layout from '../../components/layout';
import MealPlan from '../../components/meal-plans/MealPlan';
import SearchMenu from '../../components/meal-plans/SearchMenu';
import { useAuth } from '../../contexts/auth-context';
import { CustomNextPage } from '../../types/CustomNextPage';
import { Order, OrderBy, SortBy } from '../../types/mealPlanOrder.types';
import {
  orderToSortBy,
  sortByToOrder,
} from '../../utils/mealPlanSortByConversions';
import { queryParamToString } from '../../utils/queryParamConversions';
import { getMealPlans } from '../../utils/requests/meal-plans';

const MealPlans: CustomNextPage = () => {
  const router = useRouter();
  const { authClaims, authToken } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [queryParamsInitialised, setQueryParamsInitialised] = useState(false);
  const [totalCountMealPlans, setTotalCountMealPlans] = useState(0);
  const [mealPlans, setMealPlans] = useState<
    Array<{
      name: string;
      uuid: string;
    }>
  >([]);

  const onNavigate = (pathname: string) => {
    router.push({ pathname });
  };

  const [mealPlansQueryParams, setMealPlansQueryParams] = useState<{
    limit: number;
    offset: number;
    order: Order;
    orderBy: OrderBy;
    searchTerm: string;
  }>({
    limit: 8,
    offset: 0,
    order: 'any',
    orderBy: 'relevance',
    searchTerm: '',
  });

  // initializes query params
  useEffect(() => {
    if (router.isReady && !queryParamsInitialised) {
      const order = queryParamToString<Order>(router.query['order']);
      const orderBy = queryParamToString<OrderBy>(router.query['orderBy']);
      const searchTerm = queryParamToString(router.query['searchTerm']);

      setMealPlansQueryParams((current) => {
        return {
          ...current,
          order,
          orderBy,
          searchTerm,
        };
      });

      setQueryParamsInitialised(true);
    }
  }, [router.isReady, queryParamsInitialised, router.query]);

  useQuery(
    ['recipes', authClaims?.userId, authToken, mealPlansQueryParams],
    () => {
      const { order, orderBy, searchTerm, limit, offset } =
        mealPlansQueryParams;
      if (authClaims?.userId) {
        return getMealPlans({
          token: authToken,
          userId: authClaims.userId,
          order,
          orderBy,
          searchTerm,
          limit,
          offset,
          includeCount: true,
        });
      }
    },
    {
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
      staleTime: 0,
      enabled:
        queryParamsInitialised && !!authClaims?.userId && !!authToken.length,
      onSuccess: (data: any) => {
        setTotalCountMealPlans(data.count);
        setMealPlans((current) => {
          if (mealPlansQueryParams.offset === 0) {
            return data.mealPlans;
          }
          return [...current, ...data.mealPlans];
        });
        setIsLoading(false);
      },
    },
  );

  const showMore = mealPlans.length < totalCountMealPlans;

  const showNoMealPlans = () => {
    return (
      <>
        <Container maxW="1200px" mb={10}>
          <Box textAlign={'left'}>
            <Text fontSize={'2rem'} color="gray.dark" fontWeight={500}>
              Sorry, it looks you have currently have no meal plans.
            </Text>
          </Box>
          <Box height={'7rem'}>
            <Button
              height={'100%'}
              onClick={() => onNavigate('/create-plan/steps')}
            >
              <FiPlus /> Add new meal plan
            </Button>
          </Box>
        </Container>
      </>
    );
  };

  const showMealPlans = () => {
    return (
      <>
        <Container maxW="1200px" mb={10}>
          <Box textAlign={'left'}>
            <Text fontSize={'2rem'} color="gray.dark" fontWeight={500}>
              My meal plans
            </Text>
          </Box>
        </Container>

        <Container maxW="1200px" mb={10}>
          <SearchMenu
            mb={'2rem'}
            sortBy={orderToSortBy(
              mealPlansQueryParams.order,
              mealPlansQueryParams.orderBy,
            )}
            searchTerm={mealPlansQueryParams.searchTerm}
            onSearch={({ searchTerm }: { searchTerm: string }) => {
              setMealPlansQueryParams((current) => {
                return {
                  ...current,
                  offset: 0,
                  searchTerm,
                };
              });

              const { searchTerm: oldSearchTerm, ...unchangedQueryParams } =
                router.query;
              router.push({
                query: {
                  ...unchangedQueryParams,
                  ...(searchTerm.length && { searchTerm }),
                },
              });
            }}
            onSortByChange={(sortBy: SortBy) => {
              const orderAndOrderBy = sortByToOrder(sortBy);
              setMealPlansQueryParams((current) => {
                return {
                  ...current,
                  ...orderAndOrderBy,
                  offset: 0,
                };
              });

              router.push({
                query: {
                  ...router.query,
                  ...orderAndOrderBy,
                },
              });
            }}
          />

          <Text
            fontSize={'1rem'}
            color="gray.dark"
            fontWeight={600}
            mb={'2rem'}
            borderBottom={'solid 1px'}
            borderTop={'solid 1px'}
            borderColor={'gray.100'}
            py={'1rem'}
          >
            Results&nbsp;
            <Text as={'span'} fontWeight={400}>
              ({totalCountMealPlans})
            </Text>
          </Text>

          <Grid templateColumns="repeat(auto-fill, minMax(275px,1fr));" gap={5}>
            {mealPlans.map((mealPlan: any) => {
              return (
                <MealPlan
                  key={mealPlan.uuid}
                  uuid={mealPlan.uuid}
                  name={mealPlan.name}
                />
              );
            })}
            <Box height={'7rem'}>
              <Button
                height={'100%'}
                width={'100%'}
                onClick={() => onNavigate('/create-plan/steps')}
              >
                <FiPlus /> Add new meal plan
              </Button>
            </Box>
          </Grid>
        </Container>
        <Container maxW="1200px" mb={10}>
          {showMore && !!mealPlans.length && (
            <Flex justifyContent={'center'}>
              <Button
                onClick={() => {
                  setMealPlansQueryParams((current) => {
                    return {
                      ...current,
                      offset: current.offset + current.limit,
                    };
                  });
                }}
                mt={2}
                colorScheme="brand"
                fontSize={{ base: '0.9rem', md: '1.1rem' }}
                fontWeight={600}
                padding={'1.5rem 1rem'}
              >
                Show more
              </Button>
            </Flex>
          )}
        </Container>
      </>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <Container maxW={'1200px'}>
          <Box display="flex" justifyContent="center">
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
          </Box>
        </Container>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Head>
          <title>Meal Plans | Plan and Eat Well</title>
        </Head>

        <Container my={'2rem'} maxW={'1200px'}>
          {!!mealPlans.length ? showMealPlans() : showNoMealPlans()}
        </Container>
      </Layout>
    );
  }
};

MealPlans.requireAuth = true;

export default MealPlans;
