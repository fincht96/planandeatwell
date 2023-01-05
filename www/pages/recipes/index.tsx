import Head from 'next/head';
import Layout, { siteTitle } from '../../components/layout';
import type { NextPage } from 'next';
import { Box, Container, Text, Grid, Button, Flex } from '@chakra-ui/react';
import RecipeCard from '../../components/recipes/RecipeCard';
import { getRecipes } from '../../utils/api-requests/recipes';
import { useEffect, useState } from 'react';
import { orderToSortBy, sortByToOrder } from '../../utils/sortByConversions';
import { Order, OrderBy, SortBy } from '../../types/order.types';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import {
  queryParamToString,
  queryParamToStringArray,
} from '../../utils/queryParamConversions';
import SearchMenu from '../../components/recipes/SearchMenu';
import { RecipeType } from '../../types/recipe.types';

const Recipes: NextPage = (props: any) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const [fullPath, setFullPath] = useState<string>('');
  const router = useRouter();
  const updatedSiteTitle = `Recipes | ${siteTitle}`;

  useEffect(() => {
    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : '';

    const URL = `${origin}${router.pathname}`;

    setFullPath(URL); // excluding query params
  }, [router]);

  const preRenderedRecipes = props.recipes;
  const preRenderedTotalRecipesCount = props.totalCount;
  const urlHasQueryParams = Object.keys(router.query).length !== 0;

  // if there are no query params in the url then assume we are on /recipes and show the pre-rendered recipes
  const [recipes, setRecipes] = useState<Array<any>>(
    router.isReady ? (urlHasQueryParams ? [] : preRenderedRecipes) : [],
  );

  const [queryParamsInitialised, setQueryParamsInitialised] = useState(false);

  // initializes recipeQueryParams using data provided to us by server on first render
  const [recipeQueryParams, setRecipeQueryParams] = useState<{
    limit: number;
    offset: number;
    meals: Array<string>;
    lifestyles: Array<string>;
    freeFroms: Array<string>;
    order: Order;
    orderBy: OrderBy;
    searchTerm: string;
  }>({
    limit: 8,
    offset: 0,
    meals: [],
    lifestyles: [],
    freeFroms: [],
    order: 'any',
    orderBy: 'relevance',
    searchTerm: '',
  });

  const [totalCountRecipes, setTotalCountRecipes] = useState(
    preRenderedTotalRecipesCount,
  );

  const showMore = recipes.length < totalCountRecipes;

  useEffect(() => {
    if (router.isReady && !queryParamsInitialised) {
      const meals = queryParamToStringArray(router.query['meals']);
      const lifestyles = queryParamToStringArray(router.query['lifestyles']);
      const freeFroms = queryParamToStringArray(router.query['freeFroms']);
      const order = queryParamToString<Order>(router.query['order']);
      const orderBy = queryParamToString<OrderBy>(router.query['orderBy']);
      const searchTerm = queryParamToString(router.query['searchTerm']);

      setRecipeQueryParams((current) => {
        return {
          ...current,
          meals,
          lifestyles,
          freeFroms,
          order,
          orderBy,
          searchTerm,
        };
      });

      setQueryParamsInitialised(true);
    }
  }, [router.isReady, queryParamsInitialised, router.query]);

  useQuery(
    ['recipes', recipeQueryParams],
    () => {
      const {
        offset,
        limit,
        meals,
        lifestyles,
        freeFroms,
        order,
        orderBy,
        searchTerm,
      } = recipeQueryParams;
      return getRecipes({
        includeIngredientsWithRecipes: true,
        offset,
        limit,
        meals: meals.toString(),
        lifestyles: lifestyles.toString(),
        freeFroms: freeFroms.toString(),
        order,
        orderBy,
        searchTerm,
      });
    },
    {
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
      staleTime: 0,
      enabled: queryParamsInitialised && router.asPath !== '/recipes', // only trigger when query params exist and url is not just /recipes
      onSuccess: (data: any) => {
        setRecipes((current) => {
          if (recipeQueryParams.offset === 0) {
            return data.recipes;
          }
          return [...current, ...data.recipes];
        });
        setTotalCountRecipes(data.totalCount);
      },
    },
  );

  // Returns null on first render, so the client and server match
  if (!hydrated) {
    return null;
  } else {
    return (
      <>
        <Layout excludeFooter>
          <Head>
            <title>{updatedSiteTitle}</title>
          </Head>
          <Box pt={'100px'}>
            <Container maxW="1200px" mb={10}>
              <Box textAlign={'center'}>
                <Text fontSize={'2.3rem'} color="gray.dark" fontWeight={500}>
                  Recipes
                </Text>
              </Box>
            </Container>
            <Container maxW="1200px" mb={10}>
              <SearchMenu
                mb={'2rem'}
                mealsFilters={recipeQueryParams.meals}
                lifestyleFilters={recipeQueryParams.lifestyles}
                freeFromFilters={recipeQueryParams.freeFroms}
                sortBy={orderToSortBy(
                  recipeQueryParams.order,
                  recipeQueryParams.orderBy,
                )}
                searchTerm={recipeQueryParams.searchTerm}
                onSearch={({ searchTerm }: { searchTerm: string }) => {
                  setRecipeQueryParams((current) => {
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
                onFiltersChange={(filters: {
                  meals: Array<string>;
                  lifestyles: Array<string>;
                  freeFroms: Array<string>;
                }) => {
                  setRecipeQueryParams((current) => {
                    return {
                      ...current,
                      meals: filters.meals,
                      lifestyles: filters.lifestyles,
                      freeFroms: filters.freeFroms,
                      offset: 0,
                    };
                  });

                  const newMeals = filters.meals.toString();
                  const newLifestyles = filters.lifestyles.toString();
                  const newFreeFroms = filters.freeFroms.toString();

                  const {
                    meals,
                    lifestyles,
                    freeFroms,
                    ...unchangedQueryParams
                  } = router.query;

                  router.push({
                    query: {
                      ...unchangedQueryParams,
                      ...(newMeals.length && { meals: newMeals }),
                      ...(newLifestyles.length && {
                        lifestyles: newLifestyles,
                      }),
                      ...(newFreeFroms.length && { freeFroms: newFreeFroms }),
                    },
                  });
                }}
                onSortByChange={(sortBy: SortBy) => {
                  const orderAndOrderBy = sortByToOrder(sortBy);
                  setRecipeQueryParams((current) => {
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
              >
                Results
                <Text as={'span'} fontWeight={400}>
                  ({recipes.length})
                </Text>
              </Text>
            </Container>
            <Container maxW="1200px" mb={10}>
              <Grid
                templateColumns="repeat(auto-fill, minMax(220px,1fr));"
                gap={6}
              >
                {recipes.map((recipe: RecipeType) => {
                  return (
                    <RecipeCard
                      recipe={recipe}
                      key={recipe.id}
                      fullPath={fullPath}
                    />
                  );
                })}
              </Grid>
            </Container>
            <Container maxW="1200px" mb={10}>
              {showMore && !!recipes.length && (
                <Flex justifyContent={'center'}>
                  <Button
                    onClick={() => {
                      setRecipeQueryParams((current) => {
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
          </Box>
        </Layout>
      </>
    );
  }
};

// This page is pre-rendered at build time and then additional renders happen on the client
export async function getStaticProps() {
  const defaultOffset = 0;
  const defaultLimit = 8;

  const { recipes, totalCount } = await getRecipes({
    includeIngredientsWithRecipes: true,
    offset: defaultOffset,
    limit: defaultLimit,
  });

  return {
    props: {
      totalCount: totalCount,
      recipes: recipes,
      revalidate: process.env.NEXT_PUBLIC_ENV === 'development' ? 0 : 3600,
    },
  };
}

export default Recipes;
