import Head from 'next/head';
import Layout, { siteTitle } from '../../components/layout';
import type { NextPage } from 'next';
import { Box, Container, Text, Grid, Button, Flex } from '@chakra-ui/react';
import Recipe from '../../components/recipes/Recipe';
import { getRecipes } from '../../utils/api-requests/recipes';
import { useState } from 'react';
import { orderToSortBy, sortByToOrder } from '../../utils/sortByConversions';
import { Order, OrderBy, SortBy } from '../../types/order.types';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import {
  queryParamToString,
  queryParamToStringArray,
} from '../../utils/queryParamConversions';
import SearchMenu from '../../components/recipes/SearchMenu';

const Recipes: NextPage = (props: any) => {
  const router = useRouter();
  const updatedSiteTitle = `Recipes | ${siteTitle}`;

  // props passed in by next server side rendering
  const preRenderedRecipes = props.recipes;
  const preRenderedInitialQueryParams = props.initialQueryParams;
  const preRenderedTotalRecipesCount = props.totalCount;

  // sets recipes using data provided to us by server on first render
  const [recipes, setRecipes] = useState<Array<any>>(preRenderedRecipes);

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
    limit: preRenderedInitialQueryParams.limit,
    offset: preRenderedInitialQueryParams.offset,
    meals: preRenderedInitialQueryParams.meals,
    lifestyles: preRenderedInitialQueryParams.lifestyles,
    freeFroms: preRenderedInitialQueryParams.freeFroms,
    order: preRenderedInitialQueryParams.order,
    orderBy: preRenderedInitialQueryParams.orderBy,
    searchTerm: preRenderedInitialQueryParams.searchTerm,
  });

  const [totalCountRecipes, setTotalCountRecipes] = useState(
    preRenderedTotalRecipesCount,
  );

  const showMore = recipes.length < totalCountRecipes;

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
      enabled: true,
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
                    ...(newLifestyles.length && { lifestyles: newLifestyles }),
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
              templateColumns="repeat(auto-fill, minMax(275px,1fr));"
              gap={5}
            >
              {recipes.map((recipe: any) => {
                return (
                  <Recipe
                    id={recipe.id}
                    name={recipe.name}
                    pricePerServing={parseInt(recipe.pricePerServing)}
                    imagePath={recipe.imagePath}
                    key={recipe.id}
                    servings={recipe.servings}
                    cookTime={recipe.cookTime}
                    prepTime={recipe.prepTime}
                    supermarketName={recipe.supermarketName}
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
};

export async function getServerSideProps(context: any) {
  // get the query parameters from the context
  const { order, orderBy, meals, lifestyles, freeFroms, searchTerm } =
    context.query;

  const defaultOffset = 0;
  const defaultLimit = 8; // show max 8 recipes on the /recipes view

  // use query parameters in strong format to get data from api
  const { recipes, totalCount } = await getRecipes({
    includeIngredientsWithRecipes: false,
    offset: defaultOffset,
    limit: defaultLimit,
    order: order,
    orderBy: orderBy,
    meals: meals,
    lifestyles: lifestyles,
    freeFroms: freeFroms,
    searchTerm: searchTerm,
  });

  // modify query param format before we pass into jsx component
  return {
    props: {
      totalCount: totalCount,
      recipes: recipes,
      initialQueryParams: {
        offset: defaultOffset,
        limit: defaultLimit,
        order: queryParamToString<Order>(order),
        orderBy: queryParamToString<OrderBy>(orderBy),
        searchTerm: queryParamToString(searchTerm),
        lifestyles: queryParamToStringArray(lifestyles),
        meals: queryParamToStringArray(meals),
        freeFroms: queryParamToStringArray(freeFroms),
      },
    },
  };
}

export default Recipes;
