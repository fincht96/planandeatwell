import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import Layout from '../components/layout';
import MenuSummaryBar from '../components/MenuSummaryBar';
import {
  getRecipePlan,
  insertRecipePlan,
  updateRecipePlan,
} from '../utils/requests/recipe-plans';
import { getRecipes } from '../utils/requests/recipes';

const roundTo2dp = (val: number) => {
  return Math.round(val * 100) / 100;
};

const Recipe = ({
  id,
  name,
  pricePerServing,
  imagePath,
  showRemove,
  onClick,
  link,
}: {
  id: number;
  name: string;
  pricePerServing: number;
  imagePath: string;
  showRemove: Boolean;
  link: string;
  onClick: (id: number) => void;
}) => {
  return (
    <Flex
      flexDirection={'column'}
      alignItems={'stretch'}
      justifyContent={'space-between'}
    >
      <Box flexGrow={1} minH={'25rem'} position={'relative'}>
        <Image
          quality={75}
          src={`${process.env.NEXT_PUBLIC_CDN}${imagePath}`}
          layout={'fill'}
          alt={name}
          objectFit={'cover'}
        />
      </Box>

      <Stack bg={'white'} p={'1rem'} justifyContent={'space-between'}>
        <Stack spacing={'0rem'}>
          <Link href={link} isExternal={true} color="brand.500">
            {name} (4 servings)
          </Link>
        </Stack>

        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <Text color={'#444444'} fontSize={'1rem'}>
            £{pricePerServing.toFixed(2)} per serving
          </Text>

          <Box width={'10rem'} ml={'0.7rem'}>
            {showRemove ? (
              <Button
                bg={'#ffffff'}
                border={'solid 1px'}
                borderColor={'brand.500'}
                color={'brand.500'}
                fontSize={'0.9rem'}
                fontWeight={600}
                width={'100%'}
                onClick={() => onClick(id)}
              >
                - Remove Recipe
              </Button>
            ) : (
              <Button
                colorScheme="brand"
                fontSize={'0.9rem'}
                fontWeight={600}
                width={'100%'}
                onClick={() => onClick(id)}
              >
                + Add Recipe
              </Button>
            )}
          </Box>
        </Flex>
      </Stack>
    </Flex>
  );
};

interface Ingredient {
  id: number;
  name: string;
  pricePerUnit: number;
  unitQuantity: number;
  price?: number;
}

const Menu: NextPage = () => {
  const router = useRouter();
  const [recipeBasket, setRecipeBasket] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [exactIngredientsBasket, setExactIngredientsBasket] = useState<
    Array<Ingredient>
  >([]);
  // const [ingredientsBasket, setIngredientsBasket] = useState<Array<Ingredient>>(
  //   [],
  // );

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

  const recipesQuery = useQuery(['recipes'], () => getRecipes(true), {
    refetchOnMount: false,
    staleTime: Infinity,
  });

  const recipePlanQuery = useQuery({
    queryKey: [`recipePlanQuery-${recipePlanUuid}`],
    queryFn: () => getRecipePlan(recipePlanUuid, false),
    staleTime: Infinity,
    enabled: !!recipePlanUuid,
    onSuccess: (data) => {
      addRecipesToBasket(data[0].recipes.map((recipe) => recipe.id));
    },
  });

  const onNavigate = (pathname: string) => {
    // display loading
    router.push(pathname, undefined, { shallow: true });
  };

  const onRecipeClick: (id: number) => void = async (id) => {
    const operation = recipeBasket.map((recipe) => recipe.id).includes(id)
      ? 'remove recipe'
      : 'add recipe';

    const recipe = recipesQuery.data.find((recipe) => recipe.id === id);

    const {
      ingredientsList,
      imagePath,
      link,
      pricePerServing,
      ...recipeTrunc
    } = recipe;

    // update recipe basket
    setRecipeBasket(
      operation === 'add recipe'
        ? (current) => [...current, recipeTrunc]
        : (current) => current.filter((el) => el.id !== id),
    );

    // get ingredients of recipe
    const recipeIngredients = recipe.ingredientsList;

    const newExactIngredientsBasket = recipeIngredients.reduce(
      (prev: Array<Ingredient>, currentIngredient: Ingredient) => {
        let newIngredientsBasket = Array<Ingredient>();

        // find match in ingredients basket
        const match = exactIngredientsBasket.find(
          (el) => el.id === currentIngredient.id,
        );

        // if match found remove existing element and combine with
        if (match) {
          newIngredientsBasket = prev.filter(
            (el) => el.id !== currentIngredient.id,
          );

          const updatedIngredient = { ...match };

          // add recipe to basket
          if (operation === 'add recipe') {
            updatedIngredient.unitQuantity += currentIngredient.unitQuantity;
          }
          // remove recipe from basket
          else {
            updatedIngredient.unitQuantity -= currentIngredient.unitQuantity;
          }

          updatedIngredient.unitQuantity = roundTo2dp(
            updatedIngredient.unitQuantity,
          );

          newIngredientsBasket =
            updatedIngredient.unitQuantity <= 0
              ? newIngredientsBasket
              : [...newIngredientsBasket, updatedIngredient];
        }

        // if no match found, simply append to ingredients basket
        else {
          newIngredientsBasket = [...prev, currentIngredient];
        }

        newIngredientsBasket = newIngredientsBasket.map((ingredient) => ({
          ...ingredient,
          price: roundTo2dp(ingredient.unitQuantity * ingredient.pricePerUnit),
        }));

        return newIngredientsBasket;
      },
      exactIngredientsBasket,
    );

    setExactIngredientsBasket(newExactIngredientsBasket);
  };

  const addRecipesToBasket = (recipeIdList: Array<number>) => {
    // get recipes from recipeList
    const recipes = recipeIdList.map((recipeId) => {
      return recipesQuery.data.find((recipe) => recipe.id === recipeId);
    });

    // create an array of all recipes with duplicates
    const allIngredients = recipes.reduce((allIngredients, recipe) => {
      return [...allIngredients, ...recipe.ingredientsList];
    }, []);

    // get all unique ingredients in recipe
    const uniqueIngredientsIds: Array<Ingredient> = Array.from(
      new Set<Ingredient>(allIngredients.map((ing) => ing.id)),
    );

    // group each unique element and create new array
    const exactIngredientsInBasket = uniqueIngredientsIds.map((uIngId) => {
      const likeIngs = allIngredients.filter((ing) => ing.id === uIngId);

      return likeIngs.reduce(
        (prev, current) => {
          return {
            ...prev,
            ...current,
            unitQuantity: roundTo2dp(
              (prev.unitQuantity += current.unitQuantity),
            ),
          };
        },
        { unitQuantity: 0 },
      );
    });

    setRecipeBasket(
      recipes.map((recipe) => ({ id: recipe.id, name: recipe.name })),
    );

    setExactIngredientsBasket(exactIngredientsInBasket);
  };

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
        <title>Aldi Menu | Plan and Eat Well</title>
      </Head>

      <Container mt={'5rem'} w={'95vw'} maxW={'1600px'} pt={'1rem'} pb={'5rem'}>
        <Text
          fontSize={{ base: '1.2rem', md: '1.5rem' }}
          fontWeight={800}
          mb={'2rem'}
          color={'#444444'}
        >
          Aldi Recipe Collection
        </Text>
        {recipesQuery.isLoading ? (
          <>Loading</>
        ) : (
          <>
            <Flex mb={'2rem'} gap={'1rem'} overflowX={'auto'}>
              <Button
                colorScheme="brand"
                fontSize={'1rem'}
                fontWeight={400}
                minW={'content'}
                height={'2rem'}
                padding={'0rem 1rem'}
                m={0}
              >
                All recipes ({recipesQuery.data.length})
              </Button>

              {/* <Button fontSize={'0.9rem'} fontWeight={400} minW={'content'}>
                Vegetarian (2)
              </Button> */}
            </Flex>
            <Grid
              templateColumns="repeat(auto-fill, minMax(275px,1fr));"
              gap={6}
            >
              {recipesQuery.data?.map((recipe) => {
                const recipeInBasket = recipeBasket
                  .map((recipe) => recipe.id)
                  .includes(recipe.id);

                return (
                  <Box key={recipe.name}>
                    <Recipe
                      id={recipe.id}
                      name={recipe.name}
                      pricePerServing={recipe.pricePerServing}
                      imagePath={recipe.imagePath}
                      onClick={onRecipeClick}
                      showRemove={recipeInBasket}
                      link={recipe.link}
                    />
                  </Box>
                );
              })}
            </Grid>
          </>
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
