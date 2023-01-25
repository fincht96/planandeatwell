import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SlPlus } from 'react-icons/sl';
import CenteredLoadingSpinner from '../../components/CenteredLoadingSpinner';
import Layout from '../../components/layout';
import MealPlan from '../../components/meal-plans/MealPlan';
import SearchSortFilterSection from '../../components/shared/SearchSortFilterSection';
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
  const [isLessThan768] = useMediaQuery('(max-width: 768px)');
  const router = useRouter();
  const { authClaims, authToken, user } = useAuth();
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

  const mealPlanQuery = useQuery(
    ['meal-plan-query', authClaims?.userId, authToken, mealPlansQueryParams],
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
          includeSupermarketDetails: true,
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
      },
    },
  );

  const showMore = mealPlans.length < totalCountMealPlans;

  const showNoMealPlans = () => {
    return (
      <>
        <Container maxW="1200px" mb={10}>
          <Box textAlign={'left'}>
            <Text
              fontSize="2.5rem"
              color="black"
              fontWeight={700}
              textAlign={isLessThan768 ? 'center' : 'left'}
            >
              Oops, you have no meal plans...
            </Text>
          </Box>
        </Container>
        <Container maxW="1200px" mb={10}>
          <Box
            height={{
              '2xl': '18rem',
              base: '19rem',
            }}
          >
            <Button
              height={{ base: '100%', lg: '80%' }}
              width={{ base: '100%', lg: '80%' }}
              onClick={() => onNavigate('/create-plan/supermarket')}
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Box display="flex" justifyContent="center">
                  <SlPlus fontSize="1.3rem" color="black" />
                </Box>
                <Box mt="1rem">
                  <Text>Create new meal plan</Text>
                </Box>
              </Box>
            </Button>
          </Box>
        </Container>
      </>
    );
  };

  const showMealPlans = () => {
    const userFirstName = user?.displayName?.split(' ')[0];
    return (
      <>
        <Container maxW="1100px" mb={10}>
          <Flex justifyContent={'space-between'} alignItems={'center'} mb={10}>
            <Text
              noOfLines={2}
              fontSize={{ base: '1.4rem', sm: '1.7rem', md: '2rem' }}
              color="black"
              fontWeight={700}
              textAlign={'left'}
            >
              {userFirstName ? `${userFirstName}'s` : 'User'} meal plans
            </Text>
            <Box
              cursor={'pointer'}
              p={'0.5rem'}
              onClick={() => onNavigate('/create-plan/supermarket')}
              color="black"
            >
              <SlPlus fontSize="2rem" />
            </Box>
          </Flex>
          <Box>
            <Box>
              <SearchSortFilterSection
                searchFieldPlaceHolderText="Search meal plans..."
                selectValues={{
                  relevance: 'Relevance',
                  newest: 'Newest',
                }}
                sortBy={orderToSortBy(
                  mealPlansQueryParams.order,
                  mealPlansQueryParams.orderBy,
                )}
                searchTerm={mealPlansQueryParams.searchTerm}
                onSearchSubmit={({ searchTerm }: { searchTerm: string }) => {
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
                handleSortChange={(sortBy: SortBy) => {
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
            </Box>
            <Box>
              <Text fontSize={'sm'} color="black" fontWeight={600} mb={'2rem'}>
                Results&nbsp;
                <Text as={'span'} fontWeight={600} color="black">
                  ({totalCountMealPlans})
                </Text>
              </Text>
            </Box>
            <Grid
              templateColumns="repeat(auto-fill, minMax(275px,1fr));"
              gap={6}
            >
              {mealPlans.map((mealPlan: any) => {
                return (
                  <MealPlan
                    key={mealPlan.uuid}
                    uuid={mealPlan.uuid}
                    name={mealPlan.name}
                    recipesCount={mealPlan.recipesCount}
                    ingredientsCount={mealPlan.ingredientsCount}
                    totalServings={mealPlan.totalServings}
                    totalPrice={mealPlan.totalPrice}
                    supermarketName={mealPlan.supermarketName}
                  />
                );
              })}
            </Grid>
          </Box>
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

  const mealPlansView = () => {
    if (mealPlanQuery.isLoading) {
      return <CenteredLoadingSpinner />;
    }

    // no meal plans found and no search term
    if (
      !mealPlanQuery.data.mealPlans.length &&
      !mealPlansQueryParams.searchTerm.length
    ) {
      return showNoMealPlans();
    }

    return showMealPlans();
  };

  return (
    <Layout>
      <Head>
        <title>Meal Plans | Plan and Eat Well</title>
      </Head>
      <Container maxW={'1200px'}>{mealPlansView()}</Container>
    </Layout>
  );
};

MealPlans.requireAuth = true;

export default MealPlans;
