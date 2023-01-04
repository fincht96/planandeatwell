import {
  Button,
  Container,
  Flex,
  Grid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/layout';
import Recipe from '../../components/menu/Recipe';
import SearchMenu from '../../components/menu/SearchMenu';
import { Order, OrderBy, SortBy } from '../../types/menuOrder.types';
import {
  orderToSortBy,
  sortByToOrder,
} from '../../utils/menuSortByConversions';
import {
  queryParamToString,
  queryParamToStringArray,
} from '../../utils/queryParamConversions';
import {
  getMealPlan,
  insertMealPlan,
  updateMealPlan,
} from '../../utils/requests/meal-plans';
import { getRecipes } from '../../utils/requests/recipes';
import { roundTo2dp } from '../../utils/roundTo2dp';

import RecipeModal from '../../components/menu/RecipeModal';
import MenuSummaryBar from '../../components/MenuSummaryBar';
import { useAuth } from '../../contexts/auth-context';
import { CustomNextPage } from '../../types/CustomNextPage';
import { IngredientDecorated } from '../../types/ingredientDecorated.types';
import {
  addIngredients,
  addRecipeServings,
  removeIngredients,
  removeRecipeServings,
  roundUpQuantities,
  scaleIngredientQuantities,
} from '../../utils/recipeBasketHelper';

const Menu: CustomNextPage = () => {
  const { authToken } = useAuth();

  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: false });
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  const router = useRouter();
  const [recipes, setRecipes] = useState<Array<any>>([]);
  const [mealPlanQueryParams, setMealPlanQueryParams] = useState<{
    uuid: string;
  }>({ uuid: '' });
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
  const [queryParamsInitialised, setQueryParamsInitialised] = useState(false);
  const [totalCountRecipes, setTotalCountRecipes] = useState(0);
  const [recipeBasket, setRecipeBasket] = useState<
    Array<{ recipe: any; servings: number }>
  >([]);
  const [exactIngredientsBasket, setExactIngredientsBasket] = useState<
    Array<IngredientDecorated>
  >([]);
  const ingredientsBasket = useMemo(() => {
    return roundUpQuantities(exactIngredientsBasket);
  }, [exactIngredientsBasket]);

  const showMore = recipes.length < totalCountRecipes;

  const totalBasketPrice: number = useMemo(() => {
    return roundTo2dp(
      ingredientsBasket.reduce((prev, current) => {
        return prev + current.price;
      }, 0),
    );
  }, [ingredientsBasket]);

  const mealPlanMutation = useMutation({
    mutationFn: ({
      updateExisting,
      recipeIdList,
    }: {
      updateExisting: boolean;
      recipeIdList: Array<{ recipeId: number; servings: number }>;
    }) => {
      return updateExisting
        ? updateMealPlan(authToken, mealPlanQueryParams.uuid, { recipeIdList })
        : insertMealPlan(authToken, recipeIdList);
    },
    onSuccess: (data: any) => {
      return onNavigate(`/meal-plans/${data.uuid}`);
    },
  });

  const totalServingsInBasket = recipeBasket.reduce((total, currentRecipe) => {
    return currentRecipe.servings + total;
  }, 0);

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

  useQuery({
    queryKey: ['mealPlanQuery', mealPlanQueryParams.uuid],
    queryFn: () => {
      const uuid = mealPlanQueryParams.uuid;
      return getMealPlan(uuid);
    },
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    enabled: router.isReady && !!mealPlanQueryParams.uuid.length,
    onSuccess: (data) => {
      const recipes = data?.recipes ?? [];

      let tempIngredients: Array<any> = [];

      recipes.map((recipeWithServings: any) => {
        const ingredients = recipeWithServings.recipe.ingredientsList;
        const baseServings = recipeWithServings.recipe.baseServings;
        const servings = recipeWithServings.servings;
        // in each recipe scale number of servings with number of ingredients
        const scaledIngredients = scaleIngredientQuantities(
          ingredients,
          baseServings,
          servings,
        );

        // aggregate ingredients
        tempIngredients = addIngredients(tempIngredients, scaledIngredients);
      });

      setRecipeBasket(recipes);
      setExactIngredientsBasket(tempIngredients);
    },
  });

  // initializes recipeQueryParams and mealPlanQueryParams
  useEffect(() => {
    if (router.isReady && !queryParamsInitialised) {
      const meals = queryParamToStringArray(router.query['meals']);
      const lifestyles = queryParamToStringArray(router.query['lifestyles']);
      const freeFroms = queryParamToStringArray(router.query['freeFroms']);
      const order = queryParamToString<Order>(router.query['order']);
      const orderBy = queryParamToString<OrderBy>(router.query['orderBy']);
      const searchTerm = queryParamToString(router.query['searchTerm']);
      const uuid = queryParamToString(router.query['meal_plan_uuid']);

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

      setMealPlanQueryParams((current) => ({
        ...current,
        uuid,
      }));
      setQueryParamsInitialised(true);
    }
  }, [router.isReady, queryParamsInitialised, router.query]);

  const onNavigate = (pathname: string) => {
    router.push(pathname, undefined, { shallow: true });
  };

  useEffect(() => {
    if (selectedRecipe) {
      onOpen();
    }
  }, [onOpen, selectedRecipe]);

  return (
    <Layout>
      <Head>
        <title>Menu | Plan and Eat Well</title>
      </Head>

      {selectedRecipe && (
        <RecipeModal
          isOpen={isOpen}
          onClose={() => {
            setSelectedRecipe(null);
            onClose();
          }}
          recipe={selectedRecipe}
          currentServings={
            recipeBasket.find(
              (recipeInBasket) =>
                recipeInBasket.recipe.id === selectedRecipe?.id,
            )?.servings ?? 0
          }
          onAddRecipeServings={(recipe: any, servings: number) => {
            const newRecipesBasket = addRecipeServings(recipeBasket, {
              recipe,
              servings,
            });
            const ingredientsToAdd = scaleIngredientQuantities(
              recipe.ingredientsList,
              recipe.baseServings,
              servings,
            );

            const newIngredientsBasket = addIngredients(
              exactIngredientsBasket,
              ingredientsToAdd,
            );

            setRecipeBasket(newRecipesBasket);
            setExactIngredientsBasket(newIngredientsBasket);
          }}
          onRemoveRecipeServings={(recipe: any, servings: number) => {
            const newRecipesBasket = removeRecipeServings(recipeBasket, {
              recipe,
              servings,
            });
            const ingredientsToRemove = scaleIngredientQuantities(
              recipe.ingredientsList,
              recipe.baseServings,
              servings,
            );

            const newIngredientsBasket = removeIngredients(
              exactIngredientsBasket,
              ingredientsToRemove,
            );

            setRecipeBasket(newRecipesBasket);
            setExactIngredientsBasket(newIngredientsBasket);
          }}
        />
      )}

      <Container maxW={'1600px'} pt={'1rem'} pb={'5rem'}>
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

            const { meals, lifestyles, freeFroms, ...unchangedQueryParams } =
              router.query;

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

        <Text fontSize={'1rem'} color="gray.dark" fontWeight={600} mb={'2rem'}>
          Results
          <Text as={'span'} fontWeight={400}>
            ({totalCountRecipes})
          </Text>
        </Text>

        <Grid templateColumns="repeat(auto-fill, minMax(275px,1fr));" gap={6}>
          {recipes.map((recipe) => {
            const recipeInBasket = recipeBasket
              .map((recipe) => recipe.recipe.id)
              .includes(recipe.id);
            return (
              <Recipe
                id={recipe.id}
                key={recipe.id}
                name={recipe.name}
                pricePerServing={parseInt(recipe.pricePerServing)}
                imagePath={recipe.imagePath}
                baseServings={recipe.baseServings}
                cookTime={recipe.cookTime}
                prepTime={recipe.prepTime}
                supermarketName={recipe.supermarketName}
                selected={recipeInBasket}
                onClick={(recipeId) => {
                  setSelectedRecipe(
                    recipes.find((recipe) => recipe.id === recipeId),
                  );
                }}
              />
            );
          })}
        </Grid>

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
      <MenuSummaryBar
        currentPrice={totalBasketPrice}
        ingredientList={ingredientsBasket}
        recipeList={recipeBasket}
        servings={totalServingsInBasket}
        onComplete={() => {
          mealPlanMutation.mutate({
            updateExisting: !!mealPlanQueryParams.uuid.length,
            recipeIdList: recipeBasket.map((basketItem) => {
              return {
                recipeId: basketItem.recipe.id,
                servings: basketItem.servings,
              };
            }),
          });
        }}
      />
    </Layout>
  );
};

Menu.requireAuth = true;

export default Menu;
