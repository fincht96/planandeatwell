import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Icon,
  Link,
  Select,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiLink2 } from 'react-icons/fi';
import { MdModeEdit } from 'react-icons/md';
import { TiDeleteOutline } from 'react-icons/ti';
import Editable from '../../components/Editable';
import Layout from '../../components/layout';
import ConfirmCancelModal from '../../components/shared/ConfirmCancelModal';
import { useAuth } from '../../contexts/auth-context';
import { CustomNextPage } from '../../types/CustomNextPage';
import { IngredientDecorated } from '../../types/ingredientDecorated.types';
import { convertDecimalToFraction } from '../../utils/convertDecimalToFraction';
import { groupObjects } from '../../utils/groupObjects';
import {
  addIngredients,
  addScalarQuantity,
  calcTotalIngredientsPrice,
  getFormattedQuantityAndUnitText,
  getIngredientPrice,
  roundUpIngredientUnitQuantity,
  roundUpQuantities,
  scaleIngredientQuantities,
  toTwoSignificantFigures,
} from '../../utils/recipeBasketHelper';
import {
  deleteMealPlan,
  getMealPlan,
  updateMealPlan,
} from '../../utils/requests/meal-plans';

const ContentBox = ({
  title,
  rows,
  summary,
  ingredientsViewSelectComponent,
}: {
  title: any;
  rows: Array<any>;
  summary: any;
  ingredientsViewSelectComponent?: any;
}) => {
  return (
    <Box
      p={'1rem 1.5rem'}
      border={'solid #CCCCCC 1px'}
      background={'#ffffff'}
      width={'100%'}
      maxH={'min-content'}
    >
      <Flex justifyContent={'space-between'}>
        <Box>
          <Text
            fontSize={{ base: '1rem', md: '1.2rem' }}
            color="gray.dark"
            fontWeight={600}
            mb={'1rem'}
          >
            {title}
          </Text>
        </Box>
        <Box>{ingredientsViewSelectComponent}</Box>
      </Flex>
      <Box>
        {rows.map((row) => {
          return (
            <Box mb={'1rem'} key={row.id}>
              <Box>{row.content}</Box>
              <Box>{row.subContent}</Box>
            </Box>
          );
        })}
      </Box>
      <Box my={'1rem'}>
        <Divider />
      </Box>
      <Box>{summary}</Box>
    </Box>
  );
};

type PermittedIngredientsViewStates = 'ALL' | 'RECIPE' | 'CATEGORY';

const MealPlan: CustomNextPage = () => {
  const { authToken, user, authClaims } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const mealPlanUuid =
    typeof router.query.id === 'string' ? router.query.id : '';

  const [ingredientView, setIngredientView] =
    useState<PermittedIngredientsViewStates>('ALL');

  const [mealPlanName, setMealPlanName] = useState<string>('');

  const mealPlanQuery = useQuery({
    queryKey: [`recipesQuery-${mealPlanUuid}`],
    queryFn: () => getMealPlan(mealPlanUuid),
    refetchOnMount: 'always',
    staleTime: Infinity,
    enabled: !!mealPlanUuid.length,
  });

  const mealPlanMutation = useMutation({
    mutationFn: (mealPlan: {
      name: string;
      totalServings: number;
      totalPrice: number;
      ingredientsCount: number;
      recipesCount: number;
    }) => {
      return updateMealPlan(authToken, mealPlanUuid, mealPlan);
    },
    onSuccess: (data) => {
      setMealPlanName(data.name);
    },
  });

  const recipes: Array<{
    id: number;
    name: string;
    servings: number;
  }> = useMemo(() => {
    if (mealPlanQuery.isSuccess) {
      return mealPlanQuery.data.recipes;
    }
    return [];
  }, [mealPlanQuery]);

  const ingredients: Array<any> = useMemo(() => {
    if (mealPlanQuery.isSuccess) {
      let tempIngredients: Array<any> = [];

      mealPlanQuery.data.recipes.map((recipe) => {
        const ingredients = recipe.recipe.ingredientsList;
        const baseServings = recipe.recipe.baseServings;
        const servings = recipe.servings;
        // in each recipe scale number of servings with number of ingredients
        const scaledIngredients = scaleIngredientQuantities(
          ingredients,
          baseServings,
          servings,
        );

        // aggregate ingredients
        tempIngredients = addIngredients(tempIngredients, scaledIngredients);
      });

      return tempIngredients;
    }

    return [];
  }, [mealPlanQuery]);

  const mealPlanCreatedBy: number | null = (() => {
    return mealPlanQuery.isSuccess ? mealPlanQuery.data.createdBy : null;
  })();

  const editMode = !!(!!user && mealPlanCreatedBy === authClaims?.userId);

  const onNavigate = (pathname: string, query: any) => {
    router.push({ pathname, query });
  };

  const totalServings = useMemo(() => {
    return recipes.reduce((prev, current) => {
      return prev + current.servings;
    }, 0);
  }, [recipes]);

  const totalPrice = useMemo(() => {
    const roundedUpIngredients = roundUpQuantities(ingredients);
    return calcTotalIngredientsPrice(roundedUpIngredients);
  }, [ingredients]);

  const onCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.host}${router.asPath}`);
    toast({
      position: 'top',
      title: 'Link copied',
      status: 'success',
      duration: 1000,
      isClosable: true,
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({});

  const onSubmit: SubmitHandler<any> = (data, closeEditing) => {
    const totalServings = recipes.reduce((total, currentRecipe) => {
      return currentRecipe.servings + total;
    }, 0);

    if (data.mealPlanName !== mealPlanName) {
      mealPlanMutation.mutate({
        name: data.mealPlanName,
        totalServings,
        totalPrice,
        ingredientsCount: ingredients.length,
        recipesCount: recipes.length,
      });
    }
    closeEditing();
  };

  const generateRowData = () => {
    if (ingredientView === 'ALL') {
      // round up unit quantities of ingredients
      const decoratedIngredients = addScalarQuantity(ingredients);

      return decoratedIngredients?.map((ingredient: IngredientDecorated) => ({
        id: ingredient.id,
        content: (
          <Flex justifyContent={'space-between'} gap={'1rem'}>
            <Box display="flex" flexDirection="row">
              <Text
                color={'gray.dark'}
                fontSize={{ base: '0.9rem', md: '1rem' }}
                mr={1}
              >
                {roundUpIngredientUnitQuantity(ingredient)}x {ingredient.name}
              </Text>
              <Text
                color={'gray.dark'}
                fontSize={{ base: '0.9rem', md: '1rem' }}
              >
                {getFormattedQuantityAndUnitText(
                  toTwoSignificantFigures(ingredient.scalarQuantity),
                  ingredient.unit,
                )}
              </Text>
            </Box>
            <Text color={'gray.dark'} fontSize={{ base: '0.9rem', md: '1rem' }}>
              £{getIngredientPrice(ingredient)}
            </Text>
          </Flex>
        ),
      }));
    }

    if (ingredientView === 'RECIPE') {
      return recipes?.map((recipeWithServings: any) => {
        // scale ingredients in recipe depending on # of servings
        const ingredients = scaleIngredientQuantities(
          recipeWithServings.recipe.ingredientsList,
          recipeWithServings.recipe.baseServings,
          recipeWithServings.servings,
        );

        const decoratedIngredients = addScalarQuantity(ingredients);

        return {
          id: recipeWithServings.recipe.id,
          content: (
            <Flex justifyContent={'space-between'} gap={'1rem'}>
              <Text
                color={'gray.dark'}
                fontSize={{ base: '0.9rem', md: '1rem' }}
                as="b"
              >
                {recipeWithServings.recipe.name}
              </Text>
            </Flex>
          ),
          subContent: (
            <Flex flexDirection={'column'} gap={'1rem'}>
              {decoratedIngredients.map((ingredient: IngredientDecorated) => {
                return (
                  <Flex key={ingredient.id}>
                    <Text
                      color={'gray.dark'}
                      fontSize={{ base: '0.9rem', md: '1rem' }}
                      mr={1}
                    >
                      {convertDecimalToFraction(ingredient.unitQuantity, true)}{' '}
                      - {ingredient.name}
                    </Text>
                    <Text
                      color={'gray.dark'}
                      fontSize={{ base: '0.9rem', md: '1rem' }}
                    >
                      {getFormattedQuantityAndUnitText(
                        toTwoSignificantFigures(ingredient.scalarQuantity),
                        ingredient.unit,
                      )}
                    </Text>
                  </Flex>
                );
              })}
            </Flex>
          ),
        };
      });
    }

    if (ingredientView === 'CATEGORY') {
      const decoratedIngredients = addScalarQuantity(ingredients);
      const ingredientsGroupedByCategoryArray = groupObjects(
        decoratedIngredients,
        'categoryName',
      );

      return ingredientsGroupedByCategoryArray.map(
        ([categoryName, groupedIngredients]) => {
          return {
            id: categoryName,
            content: (
              <Flex justifyContent={'space-between'} gap={'1rem'}>
                <Text
                  color={'gray.dark'}
                  fontSize={{ base: '0.9rem', md: '1rem' }}
                  as="b"
                >
                  {categoryName}
                </Text>
              </Flex>
            ),
            subContent: (
              <Flex flexDirection={'column'} gap={'1rem'}>
                {groupedIngredients.map((ingredient: IngredientDecorated) => {
                  return (
                    <Flex key={ingredient.id} justifyContent={'space-between'}>
                      <Box display="flex" flexDirection="row">
                        <Text
                          color={'gray.dark'}
                          fontSize={{ base: '0.9rem', md: '1rem' }}
                          mr={1}
                        >
                          {roundUpIngredientUnitQuantity(ingredient)}x{' '}
                          {ingredient.name}
                        </Text>
                        <Text
                          color={'gray.dark'}
                          fontSize={{ base: '0.9rem', md: '1rem' }}
                        >
                          {getFormattedQuantityAndUnitText(
                            toTwoSignificantFigures(ingredient.scalarQuantity),
                            ingredient.unit,
                          )}
                        </Text>
                      </Box>
                      <Text
                        color={'gray.dark'}
                        fontSize={{ base: '0.9rem', md: '1rem' }}
                      >
                        £{getIngredientPrice(ingredient)}
                      </Text>
                    </Flex>
                  );
                })}
              </Flex>
            ),
          };
        },
      );
    }
  };

  const handleSelectChange = (event: any) => {
    if (!event.target.value) {
      setIngredientView('ALL');
    } else {
      setIngredientView(event.target.value);
    }
  };

  useEffect(() => {
    if (mealPlanQuery.isSuccess) {
      setMealPlanName(mealPlanQuery.data.name);
      setValue('mealPlanName', `${mealPlanQuery.data.name}`);
    }
  }, [mealPlanQuery.data, setValue, mealPlanQuery.isSuccess]);

  const rowData = generateRowData();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Layout includeNavBar={editMode}>
      <Head>
        <title>Meal Plan | Plan and Eat Well</title>
      </Head>

      <Container my={'2rem'} maxW={'1100px'}>
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={'5rem'}
          mb={'2rem'}
        >
          <Box flex={1}>
            <Editable
              enableEditing={editMode}
              previewValue={mealPlanName}
              handleSubmit={(e, closeEditing) => {
                handleSubmit((d) => onSubmit(d, closeEditing))(e);
              }}
              {...register('mealPlanName', {
                required: 'A name is required',
                maxLength: {
                  value: 199,
                  message: 'Must be less than 200 characters',
                },
              })}
              resetForm={() => {
                reset({ mealPlanName });
              }}
              error={{
                isError: !!errors.mealPlanName,
                message: errors.mealPlanName?.message,
              }}
              name={'mealPlanName'}
            />
          </Box>
        </Flex>
        <Flex gap={'1rem'} mb={'2rem'}>
          <Button
            bg={'#ffffff'}
            border={'solid 1px'}
            borderColor={'#cccccc'}
            color={'#4d4d4d'}
            fontSize={{ base: '0.9rem', md: '1rem' }}
            fontWeight={400}
            minW={'min-content'}
            onClick={onCopyLink}
          >
            <Flex
              justifyContent={'space-between'}
              gap={'0.5rem'}
              alignItems={'center'}
            >
              <Icon
                as={FiLink2}
                width={{ base: '1.5rem' }}
                height={{ base: '1.5rem' }}
                color={'#4d4d4d'}
              />
              <Text>Copy Link</Text>
            </Flex>
          </Button>
          {editMode && (
            <Button
              bg={'#ffffff'}
              border={'solid 1px'}
              borderColor={'brand.500'}
              color={'brand.500'}
              fontSize={'1rem'}
              fontWeight={400}
              minW={'min-content'}
              onClick={() => {
                onNavigate('/create-plan/menu', {
                  supermarket: 'aldi',
                  servings: 4,
                  meal_plan_uuid: mealPlanUuid,
                });
              }}
            >
              <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                gap={'0.5rem'}
              >
                <Icon
                  as={MdModeEdit}
                  width={{ base: '1.2rem' }}
                  height={{ base: '1.2rem' }}
                  color={'brand.500'}
                />
                <Text>Edit meal plan</Text>
              </Flex>
            </Button>
          )}
          <Button
            colorScheme="red"
            color={'white'}
            fontSize={'1rem'}
            fontWeight={400}
            minW={'min-content'}
            onClick={() => {
              onOpen();
            }}
          >
            <Flex
              justifyContent={'space-between'}
              gap={'0.5rem'}
              alignItems={'center'}
            >
              <Icon
                as={TiDeleteOutline}
                width={{ base: '1.5rem' }}
                height={{ base: '1.5rem' }}
                color={'white'}
              />
              <Text>Delete meal plan</Text>
            </Flex>
          </Button>
          <ConfirmCancelModal
            isOpen={isOpen}
            onClose={onClose}
            headerText="Are you sure you want to delete this meal plan?"
            confirmColorScheme={'red'}
            handleConfirmClick={async () => {
              const response = await deleteMealPlan(authToken, mealPlanUuid);

              if (response.uuid) {
                toast({
                  position: 'top',
                  title: 'Meal plan deleted succesfully',
                  status: 'success',
                  duration: 1000,
                  isClosable: true,
                });
                onClose();
                router.push('/meal-plans');
              } else {
                toast({
                  position: 'top',
                  title: `Meal plan delete error: ${response}`,
                  status: 'error',
                  duration: 1000,
                  isClosable: true,
                });
              }
            }}
          />
        </Flex>
        <Grid
          templateColumns={{
            base: '1fr',
            lg: '1fr 0.5fr',
          }}
          gap={6}
        >
          <ContentBox
            ingredientsViewSelectComponent={
              <Select size="sm" onChange={handleSelectChange}>
                <option value="ALL">All</option>
                <option value="RECIPE">Recipes</option>
                <option value="CATEGORY">Categories</option>
              </Select>
            }
            title={
              <Text as={'span'}>
                Ingredients{' '}
                <Text as={'span'} fontWeight={200}>
                  ({ingredients?.length})
                </Text>
              </Text>
            }
            rows={rowData ? rowData : []}
            summary={
              ingredientView !== 'RECIPE' && (
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                  <Text
                    fontWeight={'600'}
                    color={'#4d4d4d'}
                    fontSize={{ base: '0.9rem', md: '1rem' }}
                  >
                    Total price
                  </Text>
                  <Text
                    fontWeight={'600'}
                    color={'#4d4d4d'}
                    fontSize={{ base: '0.9rem', md: '1rem' }}
                  >
                    £{totalPrice.toFixed(2)}
                  </Text>
                </Flex>
              )
            }
          />

          <Box gridRow={{ base: 1, lg: 'auto' }}>
            <ContentBox
              title={
                <Text as={'span'}>
                  Recipes{' '}
                  <Text as={'span'} fontWeight={200}>
                    ({recipes.length})
                  </Text>
                </Text>
              }
              rows={recipes.map((recipeWithServings: any) => ({
                id: recipeWithServings.recipe.id,
                content: (
                  <Flex justifyContent={'space-between'} gap={'1rem'}>
                    <Text
                      color={'gray.dark'}
                      as={Link}
                      sx={{ textDecoration: 'underline' }}
                      _hover={{ color: 'brand.500' }}
                      href={`${process.env.NEXT_PUBLIC_WWW_URL}/recipes/${recipeWithServings.recipe.id}?servings=${recipeWithServings.servings}`}
                      isExternal
                      fontSize={{ base: '0.9rem', md: '1rem' }}
                    >
                      {recipeWithServings.recipe.name}
                    </Text>

                    <Text
                      color={'gray.dark'}
                      fontSize={{ base: '0.9rem', md: '1rem' }}
                    >
                      {recipeWithServings.servings} servings
                    </Text>
                  </Flex>
                ),
              }))}
              summary={
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                  <Text
                    fontWeight={'600'}
                    color={'#4d4d4d'}
                    fontSize={{ base: '0.9rem', md: '1rem' }}
                  >
                    Servings
                  </Text>
                  <Text
                    fontWeight={'600'}
                    color={'#4d4d4d'}
                    fontSize={{ base: '0.9rem', md: '1rem' }}
                  >
                    {totalServings}
                  </Text>
                </Flex>
              }
            />
          </Box>
        </Grid>
      </Container>
    </Layout>
  );
};
MealPlan.requireAuth = false;
export default MealPlan;
