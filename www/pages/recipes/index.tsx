import Head from 'next/head';
import Layout, { siteTitle } from '../../components/layout';
import type { NextPage } from 'next';
import {
  Box,
  Container,
  Text,
  Grid,
  Button,
  Flex,
  Center,
} from '@chakra-ui/react';
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
import SearchSortFilterSection from '../../components/shared/SearchSortFilterSection';

const Recipes: NextPage = (props: any) => {
  const [fullPath, setFullPath] = useState<string>('');
  const router = useRouter();
  const updatedSiteTitle = `Recipes | ${siteTitle}`;
  const [recipes, setRecipes] = useState<Array<any>>([]);
  const [queryParamsInitialised, setQueryParamsInitialised] = useState(false);
  const [totalCountRecipes, setTotalCountRecipes] = useState(0);
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
    limit: 12,
    offset: 0,
    meals: [],
    lifestyles: [],
    freeFroms: [],
    order: 'any',
    orderBy: 'relevance',
    searchTerm: '',
  });
  const showMore = recipes.length < totalCountRecipes;

  useEffect(() => {
    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : '';

    const URL = `${origin}${router.pathname}`;

    setFullPath(URL); // excluding query params
  }, [router]);

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
      enabled: queryParamsInitialised,
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

  return (
    <>
      <Layout excludeFooter>
        <Head>
          <title>{updatedSiteTitle}</title>
        </Head>
        <Box pt={'100px'}>
          <Container maxW="1200px" mb={10}>
            <Text
              noOfLines={2}
              fontSize={{ base: '1.4rem', sm: '1.9rem', md: '2.25rem' }}
              color="black"
              fontWeight={800}
              textAlign="center"
            >
              Recipes
            </Text>
          </Container>
          <Container maxW="1200px" mb={10}>
            <SearchSortFilterSection
              showRecipesFilter={true}
              selectValues={{
                relevance: 'Relevance',
                newest: 'Newest',
                priceAscending: 'Lowest Price',
                priceDescending: 'Highest Price',
              }}
              searchFieldPlaceHolderText="Search recipes..."
              mealsFilters={recipeQueryParams.meals}
              lifestyleFilters={recipeQueryParams.lifestyles}
              freeFromFilters={recipeQueryParams.freeFroms}
              sortBy={orderToSortBy(
                recipeQueryParams.order,
                recipeQueryParams.orderBy,
              )}
              searchTerm={recipeQueryParams.searchTerm}
              onSearchSubmit={({ searchTerm }: { searchTerm: string }) => {
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
              handleSortChange={(sortBy: SortBy) => {
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
            <Text fontSize={'sm'} color="black" fontWeight={600} mb={'2rem'}>
              Results&nbsp;
              <Text as={'span'} fontWeight={600} color="black">
                ({recipes.length})
              </Text>
            </Text>
          </Container>
          <Container maxW="1200px" mb={10}>
            <Grid
              templateColumns="repeat(auto-fill, minMax(270px, 1fr));"
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
          <Container maxW="1200px">
            {showMore && !!recipes.length && (
              <Flex justifyContent="center" alignItems="center" pb="3rem">
                <Button
                  onClick={() => {
                    setRecipeQueryParams((current) => {
                      return {
                        ...current,
                        offset: current.offset + current.limit,
                      };
                    });
                  }}
                  height="3rem"
                  colorScheme="brand"
                  fontSize="sm"
                  fontWeight={600}
                  padding={'1.5rem 1.5rem'}
                  borderRadius="lg"
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
};

export default Recipes;
