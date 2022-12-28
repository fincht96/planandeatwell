import { Button, Container, Flex, Grid, Text } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from '../../components/layout';
import SearchMenu from '../../components/menu/SearchMenu';
import Recipe from '../../components/Recipe';
import { useEventBus } from '../../hooks/useEventBus';
import { Event } from '../../types/eventBus.types';
import { Order, OrderBy, SortBy } from '../../types/order.types';
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
import { orderToSortBy, sortByToOrder } from '../../utils/sortByConversions';

import MenuSummaryBar from '../../components/MenuSummaryBar';
import { CustomNextPage } from '../../types/CustomNextPage';
import { IngredientDecorated } from '../../types/ingredientDecorated.types';

const Menu: CustomNextPage = () => {
  const { subscribe, unsubscribe, post } = useEventBus();
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
  const [recipeBasket, setRecipeBasket] = useState<Array<any>>([]);
  const [exactIngredientsBasket, setExactIngredientsBasket] = useState<
    Array<IngredientDecorated>
  >([]);
  const ingredientsBasket = useMemo(() => {
    return exactIngredientsBasket.map((ingredient) => {
      const unitQuantity = Math.ceil(ingredient.unitQuantity);
      const price = roundTo2dp(unitQuantity * ingredient.pricePerUnit);

      return {
        ...ingredient,
        unitQuantity,
        price,
      };
    });
  }, [exactIngredientsBasket]);

  const updateRecipesInBasket = useCallback(
    (recipeId: number) => {
      const recipeInBasket = recipeBasket.find(
        (recipe) => recipe.id === recipeId,
      );

      post({
        name: recipeInBasket
          ? 'remove-recipe-ingredients'
          : 'add-recipe-ingredients',
        data: `${recipeId}`,
      });

      const { ingredientsList, ...recipe } = recipes.find(
        (recipe) => recipe.id === recipeId,
      );

      setRecipeBasket((currentRecipeBasket: Array<any>) => {
        return recipeInBasket
          ? currentRecipeBasket.filter((recipe) => recipe.id !== recipeId)
          : [...currentRecipeBasket, recipe];
      });
    },
    [post, recipeBasket, recipes],
  );

  const removeRecipeIngredientsFromBasket = useCallback(
    (recipeId: number) => {
      // get recipe ingredients to be removed
      const ingredientsToRemove = recipes.find(
        (recipe) => recipe.id === recipeId,
      )?.ingredientsList;

      // subtract ingredients from ingredients basket
      const newExactIngredientsBasket = exactIngredientsBasket.reduce(
        (newExactIngredientsBasket, basketIngredient) => {
          const ingredientToRemove = ingredientsToRemove.find(
            (ingredient: IngredientDecorated) =>
              ingredient.id === basketIngredient.id,
          );

          if (ingredientToRemove) {
            const updatedIngredient = {
              ...basketIngredient,
              unitQuantity: (basketIngredient.unitQuantity -=
                ingredientToRemove.unitQuantity),
            };

            return updatedIngredient.unitQuantity <= 0.0001
              ? newExactIngredientsBasket
              : [...newExactIngredientsBasket, updatedIngredient];
          }

          return [...newExactIngredientsBasket, { ...basketIngredient }];
        },
        Array<IngredientDecorated>(),
      );

      setExactIngredientsBasket(newExactIngredientsBasket);
    },
    [recipes, exactIngredientsBasket],
  );

  const addRecipeIngredientsToBasket = useCallback(
    (recipeId: number) => {
      // get recipe ingredients to be added
      const ingredientsToAdd: Array<IngredientDecorated> = recipes.find(
        (recipe) => recipe.id === recipeId,
      )?.ingredientsList;

      // add ingredients to ingredients basket
      const newExactIngredientsBasket = ingredientsToAdd.reduce(
        (newExactIngredientsBasket, ingredientToAdd) => {
          const existingIngredient = newExactIngredientsBasket.find(
            (ingredient) => ingredient.id === ingredientToAdd.id,
          );

          // if no existing ingredient found simply append
          if (!existingIngredient) {
            return [...newExactIngredientsBasket, { ...ingredientToAdd }];
          }

          // update existing ingredient
          else {
            const updatedIngredient = {
              ...existingIngredient,
              unitQuantity: (existingIngredient.unitQuantity +=
                ingredientToAdd.unitQuantity),
            };

            return newExactIngredientsBasket.map((ingredient) => {
              if (updatedIngredient.id === ingredient.id) {
                return updatedIngredient;
              }
              return ingredient;
            });
          }
        },
        exactIngredientsBasket,
      );

      setExactIngredientsBasket(newExactIngredientsBasket);
    },
    [exactIngredientsBasket, recipes],
  );

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
      recipeIdList: Array<number>;
    }) => {
      return updateExisting
        ? updateMealPlan(mealPlanQueryParams.uuid, { recipeIdList })
        : insertMealPlan(recipeIdList);
    },
    onSuccess: (data: any) => {
      return onNavigate(`/meal-plans/${data.uuid}`);
    },
  });

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
      return getMealPlan(uuid, true);
    },
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    enabled: router.isReady && !!mealPlanQueryParams.uuid.length,
    onSuccess: (data) => {
      const recipes = data[0].recipes ?? [];
      const ingredients = data[0].ingredients ?? [];
      setRecipeBasket(recipes);
      setExactIngredientsBasket(ingredients);
    },
  });

  // add/remove recipe id to recipe basket
  useEffect(() => {
    const recipeClickedSubscriber = {
      notify(event: Event) {
        if (event.name === 'recipe-clicked') {
          const id = parseInt(event.data);
          updateRecipesInBasket(id);
        }
      },
    };

    subscribe(recipeClickedSubscriber);
    return () => unsubscribe(recipeClickedSubscriber);
  }, [subscribe, unsubscribe, post, updateRecipesInBasket]);

  // remove recipe ingredients from basket
  useEffect(() => {
    const recipeRemovedSubscriber = {
      notify(event: Event) {
        if (event.name === 'remove-recipe-ingredients') {
          const id = parseInt(event.data);
          removeRecipeIngredientsFromBasket(id);
        }
      },
    };
    subscribe(recipeRemovedSubscriber);
    return () => unsubscribe(recipeRemovedSubscriber);
  }, [subscribe, unsubscribe, removeRecipeIngredientsFromBasket]);

  // add recipe ingredients to basket
  useEffect(() => {
    const recipeInsertSubscriber = {
      notify(event: Event) {
        if (event.name === 'add-recipe-ingredients') {
          const id = parseInt(event.data);
          addRecipeIngredientsToBasket(id);
        }
      },
    };
    subscribe(recipeInsertSubscriber);
    return () => unsubscribe(recipeInsertSubscriber);
  }, [subscribe, unsubscribe, addRecipeIngredientsToBasket]);

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

  // on recipe clicked notifies event bus
  const onRecipeClick = (id: number) => {
    post({ name: 'recipe-clicked', data: `${id}` });
  };

  return (
    <Layout>
      <Head>
        <title>Menu | Plan and Eat Well</title>
      </Head>

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
              .map((recipe) => recipe.id)
              .includes(recipe.id);
            return (
              <Recipe
                id={recipe.id}
                name={recipe.name}
                pricePerServing={recipe.pricePerServing}
                imagePath={recipe.imagePath}
                onClick={onRecipeClick}
                showRemove={recipeInBasket}
                link={recipe.link}
                key={recipe.id}
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
        servings={recipeBasket.length * 4}
        onComplete={() => {
          mealPlanMutation.mutate({
            updateExisting: !!mealPlanQueryParams.uuid.length,
            recipeIdList: recipeBasket.map((recipe) => recipe.id),
          });
        }}
      />
    </Layout>
  );
};

Menu.requireAuth = true;

export default Menu;
