import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../components/layout';
import Recipe from '../components/Recipe';
import { Event, useEventBus } from '../components/useEventBus';
import {
  getRecipePlan,
  insertRecipePlan,
  updateRecipePlan,
} from '../utils/requests/recipe-plans';
import { getRecipes } from '../utils/requests/recipes';

import { IoOptions } from 'react-icons/io5';
import MenuSummaryBar from '../components/MenuSummaryBar';

const roundTo2dp = (val: number) => {
  return Math.round(val * 100) / 100;
};

interface Ingredient {
  id: number;
  name: string;
  pricePerUnit: number;
  unitQuantity: number;
  price?: number;
}

const SearchMenu = ({ ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <Box {...props}>
      <Input placeholder="Search" background={'#ffffff'} mb={'2rem'} />

      <Button
        ref={btnRef}
        colorScheme="teal"
        onClick={onOpen}
        leftIcon={<IoOptions />}
      >
        Filter
      </Button>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Input placeholder="Type here..." />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

const Menu: NextPage = () => {
  const { subscribe, unsubscribe, post } = useEventBus();

  const limit = 10;
  const [offset, setOffset] = useState(0);
  const [totalCountRecipes, setTotalCountRecipes] = useState(0);
  const showMore = useMemo(() => {
    return (
      offset * limit + limit - 1 <= totalCountRecipes || totalCountRecipes === 0
    );
  }, [offset, limit, totalCountRecipes]);

  const router = useRouter();
  const [recipeBasket, setRecipeBasket] = useState<Array<any>>([]);
  const [exactIngredientsBasket, setExactIngredientsBasket] = useState<
    Array<Ingredient>
  >([]);

  const [recipes, setRecipes] = useState<Array<any>>([]);

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

  const recipePlanUuid =
    typeof router.query.recipe_plan_uuid === 'string'
      ? router.query.recipe_plan_uuid
      : '';

  const recipePlanMutation = useMutation({
    mutationFn: ({
      updateExisting,
      recipeIdList,
    }: {
      updateExisting: boolean;
      recipeIdList: Array<number>;
    }) => {
      return updateExisting
        ? updateRecipePlan(recipePlanUuid, { recipeIdList })
        : insertRecipePlan(recipeIdList);
    },
    onSuccess: (data: any) => {
      return onNavigate(`/recipe-plan/${data.uuid}`);
    },
  });

  const recipesQuery = useQuery(  // are we no longer using this?
    ['recipes', offset, limit],
    () =>
      getRecipes({
        includeIngredientsWithRecipes: true,
        offset,
        limit,
      }),
    {
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
      staleTime: 0,
      enabled: router.isReady,
      onSuccess: (data: any) => {
        setRecipes((current) => [...current, ...data.recipes]);
        setTotalCountRecipes(data.totalCount);
      },
    },
  );

  const recipePlanQuery = useQuery({ // are we no longer using this?
    queryKey: [`recipePlanQuery`, recipePlanUuid],
    queryFn: () => getRecipePlan(recipePlanUuid, true),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    enabled: router.isReady && !!recipePlanUuid.length,
    onSuccess: (data) => {
      const recipes = data[0].recipes ?? [];
      const ingredients = data[0].ingredients ?? [];
      setRecipeBasket(recipes);
      setExactIngredientsBasket(ingredients);
    },
  });

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
            (ingredient: Ingredient) => ingredient.id === basketIngredient.id,
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
        Array<Ingredient>(),
      );

      setExactIngredientsBasket(newExactIngredientsBasket);
    },
    [recipes, exactIngredientsBasket],
  );

  const addRecipeIngredientsToBasket = useCallback(
    (recipeId: number) => {
      // get recipe ingredients to be added
      const ingredientsToAdd = recipes.find(
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

  const onNavigate = (pathname: string) => {
    // display loading
    router.push(pathname, undefined, { shallow: true });
  };

  const onRecipeClick = (id: number) => {
    post({ name: 'recipe-clicked', data: `${id}` });
  };

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

  const totalBasketPrice: number = useMemo(() => {
    return roundTo2dp(
      ingredientsBasket.reduce((prev, current) => {
        return prev + current.price;
      }, 0),
    );
  }, [ingredientsBasket]);

  const totalBasketPriceExact: number = useMemo(() => {
    return roundTo2dp(
      exactIngredientsBasket.reduce((prev, current) => {
        return prev + current.price;
      }, 0),
    );
  }, [exactIngredientsBasket]);

  return (
    <Layout>
      <Head>
        <title>Menu | Plan and Eat Well</title>
      </Head>

      <Container mt={'5rem'} w={'95vw'} maxW={'1600px'} pt={'1rem'} pb={'5rem'}>
        <SearchMenu mb={'4rem'} />
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
                setOffset((current) => current + limit);
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
          recipePlanMutation.mutate({
            updateExisting: !!recipePlanUuid,
            recipeIdList: recipeBasket.map((recipe) => recipe.id),
          });
        }}
      />
    </Layout>
  );
};

export default Menu;
