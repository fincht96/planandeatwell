import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ImCopy } from 'react-icons/im';
import {
  SlActionRedo,
  SlBasketLoaded,
  SlClock,
  SlInfo,
  SlPeople,
  SlTrash,
} from 'react-icons/sl';
import CustomEditable from '../../components/Editable';
import Layout from '../../components/layout';
import RecipeModal from '../../components/menu/RecipeModal';
import ConfirmCancelModal from '../../components/shared/ConfirmCancelModal';
import { useAuth } from '../../contexts/auth-context';
import { CustomNextPage } from '../../types/CustomNextPage';
import { IngredientDecorated } from '../../types/ingredientDecorated.types';
import { MealPlanWithSupermarketDetailsType } from '../../types/mealPlan.types';
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
  supermarket,
}: {
  title: any;
  rows: Array<any>;
  summary: any;
  ingredientsViewSelectComponent?: any;
  supermarket: any;
}) => {
  return (
    <>
      <Flex direction="row" align="center">
        <Box>{title}</Box>
        <Box>{supermarket}</Box>
      </Flex>
      <Box borderRadius="xl" width={'100%'} maxH={'min-content'}>
        <Box mb="1.5rem">{ingredientsViewSelectComponent}</Box>
        <Box>
          {rows.map((row) => {
            return (
              <Box key={row.id}>
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
    </>
  );
};

type PermittedIngredientsViewStates = 'ALL' | 'RECIPE' | 'CATEGORY';

const MealPlan: CustomNextPage = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

  const [mealPlan, setMealPlan] =
    useState<MealPlanWithSupermarketDetailsType | null>(null);
  const { authToken, user, authClaims } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const mealPlanUuid =
    typeof router.query.id === 'string' ? router.query.id : '';

  const {
    isOpen: isRecipeOpen,
    onClose: onRecipeClose,
    onOpen: onRecipeOpen,
  } = useDisclosure({
    defaultIsOpen: false,
  });

  useEffect(() => {
    if (selectedRecipe) {
      onRecipeOpen();
    }
  }, [onRecipeOpen, selectedRecipe]);

  const [ingredientView, setIngredientView] =
    useState<PermittedIngredientsViewStates>('ALL');

  const [mealPlanName, setMealPlanName] = useState<string>('');

  const mealPlanQuery = useQuery({
    queryKey: [`recipesQuery-${mealPlanUuid}`],
    queryFn: () =>
      getMealPlan({ mealPlanUuid, includeSupermarketDetails: true }),
    refetchOnMount: 'always',
    staleTime: Infinity,
    enabled: !!mealPlanUuid.length,
    onSuccess: (data: MealPlanWithSupermarketDetailsType) => {
      setMealPlan(data);
    },
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
          <Flex justifyContent={'space-between'} mb="0.5rem">
            <Box display="flex" flexDirection={{ base: 'column', md: 'row' }}>
              <Text color={'gray.bone'} fontSize="sm" mr={1} fontWeight="600">
                {roundUpIngredientUnitQuantity(ingredient)}x {ingredient.name}
              </Text>
              <Text color="gray.dark" fontSize="sm" fontWeight="600">
                {getFormattedQuantityAndUnitText(
                  toTwoSignificantFigures(ingredient.scalarQuantity),
                  ingredient.unit,
                )}
              </Text>
            </Box>
            <Text color={'gray.bone'} fontSize="sm" mr={1} fontWeight="600">
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
            <Flex justifyContent={'space-between'}>
              <Text color="black" fontSize="sm" as="b" mb="0.3rem">
                {recipeWithServings.recipe.name} - (
                {recipeWithServings.servings}) servings
              </Text>
            </Flex>
          ),
          subContent: (
            <Flex flexDirection={'column'} mb="0.3rem">
              {decoratedIngredients.map((ingredient: IngredientDecorated) => {
                return (
                  <Flex
                    key={ingredient.id}
                    mb="0.3rem"
                    direction={{ base: 'column', md: 'row' }}
                  >
                    <Text
                      color={'gray.bone'}
                      fontSize="sm"
                      fontWeight="600"
                      mr={1}
                    >
                      {ingredient.name}
                    </Text>
                    <Text color={'gray.dark'} fontSize="sm" fontWeight="600">
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
              <Flex justifyContent={'space-between'}>
                <Text color="black" fontSize="sm" as="b" mb="0.3rem">
                  {categoryName}
                </Text>
              </Flex>
            ),
            subContent: (
              <Flex flexDirection={'column'} mb="0.3rem">
                {groupedIngredients.map((ingredient: IngredientDecorated) => {
                  return (
                    <Flex
                      key={ingredient.id}
                      justifyContent={'space-between'}
                      mb="0.3rem"
                    >
                      <Box
                        display="flex"
                        flexDirection={{ base: 'column', md: 'row' }}
                      >
                        <Text
                          color={'gray.bone'}
                          fontSize="sm"
                          mr={1}
                          fontWeight="600"
                        >
                          {roundUpIngredientUnitQuantity(ingredient)}x{' '}
                          {ingredient.name}
                        </Text>
                        <Text
                          color={'gray.dark'}
                          fontSize="sm"
                          fontWeight="600"
                        >
                          {getFormattedQuantityAndUnitText(
                            toTwoSignificantFigures(ingredient.scalarQuantity),
                            ingredient.unit,
                          )}
                        </Text>
                      </Box>
                      <Text color={'gray.bone'} fontSize="sm" fontWeight="600">
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
      {selectedRecipe && (
        <RecipeModal
          isOpen={isRecipeOpen}
          onClose={() => {
            setSelectedRecipe(null);
            onRecipeClose();
          }}
          recipe={selectedRecipe}
          currentServings={selectedRecipe.selectedServings}
        />
      )}
      <Container maxW="1100px" mb={10}>
        <Box>
          <Text
            noOfLines={2}
            fontSize={{ base: '1.4rem', sm: '1.7rem', md: '2rem' }}
            color="black"
            fontWeight={600}
            textAlign={{ base: 'center', '2xl': 'left' }}
          >
            {mealPlanName}
          </Text>
        </Box>
      </Container>
      <Container maxW={{ base: '500px', lg: '700px', xl: '1100px' }}>
        <Tabs isFitted defaultIndex={0}>
          <TabList>
            <Tab color="black">
              <Text fontSize={'1rem'} fontWeight={600} color="black">
                Meals
              </Text>
            </Tab>
            <Tab color="black">
              <Text fontSize={'1rem'} fontWeight={600} color="black">
                Ingredients
              </Text>
            </Tab>
            {editMode && (
              <Tab color="black">
                <Text fontSize={'1rem'} fontWeight={600} color="black">
                  Edit plan
                </Text>
              </Tab>
            )}
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <Flex direction="row">
                <Text
                  fontSize={'sm'}
                  color="black"
                  fontWeight={600}
                  my="1.5rem"
                  mr="1rem"
                >
                  Total servings&nbsp;
                  <Text as={'span'} fontWeight={600} color="black">
                    ({totalServings})
                  </Text>
                </Text>
                <Text
                  fontSize={'sm'}
                  color="black"
                  fontWeight={600}
                  my="1.5rem"
                >
                  Recipes&nbsp;
                  <Text as={'span'} fontWeight={600} color="black">
                    ({recipes.length})
                  </Text>
                </Text>
              </Flex>
              {recipes.map((recipeWithServings: any) => {
                return (
                  <>
                    <Card
                      cursor={'pointer'}
                      key={recipeWithServings.id}
                      direction={{ base: 'column', sm: 'row' }}
                      overflow="hidden"
                      variant="outline"
                      borderRadius="xl"
                      borderColor="gray.light"
                      mb="1.5rem"
                      _hover={{
                        bg: 'gray.searchBoxGray',
                      }}
                      onClick={() => {
                        setSelectedRecipe({
                          ...recipeWithServings.recipe,
                          selectedServings: recipeWithServings.servings,
                        });
                      }}
                    >
                      <Box width={{ base: '100%', sm: '400px' }} height="200px">
                        <Image
                          objectFit="cover"
                          height="100%"
                          width="100%"
                          src={`${process.env.NEXT_PUBLIC_CDN}/${process.env.NODE_ENV}/${recipeWithServings.recipe.imagePath}`}
                          alt={recipeWithServings.name}
                        />
                      </Box>
                      <Stack>
                        <CardBody>
                          <Heading fontSize="xl">
                            {recipeWithServings.recipe.name}
                          </Heading>
                          <Flex flexDirection="row" alignItems="center" mt={3}>
                            <Flex
                              flexDirection="column"
                              justifyContent="flex-start"
                              mr="1.5rem"
                            >
                              <Flex alignItems="center" mb="0.8rem">
                                <SlClock fontSize="1rem" />
                                <Text
                                  color={'gray.dark'}
                                  fontWeight={'600'}
                                  letterSpacing={'wide'}
                                  fontSize={{ base: '0.8rem', lg: '0.9rem' }}
                                  ml={'0.5rem'}
                                >
                                  {recipeWithServings.recipe.prepTime +
                                    recipeWithServings.recipe.cookTime}
                                  mins total
                                </Text>
                              </Flex>
                              <Flex alignItems="center">
                                <SlInfo fontSize="1rem" />
                                <Text
                                  color={'gray.dark'}
                                  fontWeight={'600'}
                                  letterSpacing={'wide'}
                                  fontSize={{ base: '0.8rem', lg: '0.9rem' }}
                                  ml={'0.5rem'}
                                >
                                  £
                                  {recipeWithServings.recipe.pricePerServing.toFixed(
                                    2,
                                  )}{' '}
                                  per serving
                                </Text>
                              </Flex>
                            </Flex>
                            <Flex
                              flexDirection="column"
                              justifyContent="flex-start"
                            >
                              <Flex alignItems="center" mb="0.8rem">
                                <SlPeople fontSize="1rem" />
                                <Text
                                  color={'gray.dark'}
                                  fontWeight={'600'}
                                  letterSpacing={'wide'}
                                  fontSize={{ base: '0.8rem', lg: '0.9rem' }}
                                  ml={'0.5rem'}
                                >
                                  Serves ({recipeWithServings.servings})
                                </Text>
                              </Flex>
                              <Flex alignItems="center">
                                <SlBasketLoaded fontSize="1rem" />
                                <Text
                                  color={'gray.dark'}
                                  fontWeight={'600'}
                                  letterSpacing={'wide'}
                                  fontSize={{ base: '0.8rem', lg: '0.9rem' }}
                                  ml={'0.5rem'}
                                >
                                  Ingredients (
                                  {recipeWithServings.recipe.ingredientsCount})
                                </Text>
                              </Flex>
                            </Flex>
                          </Flex>
                        </CardBody>
                      </Stack>
                    </Card>
                  </>
                );
              })}
            </TabPanel>
            <TabPanel p={0}>
              <ContentBox
                ingredientsViewSelectComponent={
                  <Select
                    height="3rem"
                    bg="gray.searchBoxGray"
                    onChange={handleSelectChange}
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.bone"
                    width={{ base: '28%', xl: '12%' }}
                  >
                    <option value="ALL">All</option>
                    <option value="RECIPE">Recipes</option>
                    <option value="CATEGORY">Categories</option>
                  </Select>
                }
                title={
                  <Text
                    fontSize={'sm'}
                    color="black"
                    fontWeight={600}
                    my="1.5rem"
                    mr="1rem"
                  >
                    Ingredients&nbsp;
                    <Text as={'span'} fontWeight={600} color="black">
                      ({ingredients?.length})
                    </Text>
                  </Text>
                }
                supermarket={
                  <Text fontSize={'sm'} color="black" fontWeight={600}>
                    ({mealPlan?.supermarketName})
                  </Text>
                }
                rows={rowData ? rowData : []}
                summary={
                  ingredientView !== 'RECIPE' && (
                    <Flex
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <Text fontWeight="600" color="black" fontSize="sm">
                        Total price
                      </Text>
                      <Text fontWeight={'600'} color="black" fontSize="sm">
                        £{totalPrice.toFixed(2)}
                      </Text>
                    </Flex>
                  )
                }
              />
            </TabPanel>
            <TabPanel p={0}>
              <Grid
                templateColumns={{
                  base: 'repeat(1, 1fr);',
                  md: 'repeat(2, 1fr);',
                }}
                gap={4}
                my="1.5rem"
              >
                <GridItem
                  borderRadius="xl"
                  height="115px"
                  display="flex"
                  justifyContent="center"
                  bg="gray.searchBoxGray"
                >
                  <Flex
                    direction="column"
                    justifyContent="center"
                    align="center"
                  >
                    <Text fontSize="md" fontWeight="600" mb={2}>
                      Edit plan name
                    </Text>
                    <CustomEditable
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
                  </Flex>
                </GridItem>
                <GridItem
                  borderRadius="xl"
                  height="115px"
                  display="flex"
                  justifyContent="center"
                  bg="gray.searchBoxGray"
                >
                  <Flex
                    direction="column"
                    justifyContent="center"
                    align="center"
                  >
                    <Text fontSize="md" fontWeight="600" mb={2}>
                      Edit recipes in plan
                    </Text>
                    <Button
                      height="3rem"
                      width="12rem"
                      colorScheme="brand"
                      fontSize="sm"
                      fontWeight="600"
                      onClick={() => {
                        onNavigate('/create-plan/menu', {
                          supermarketId: mealPlan?.supermarketId.toString(),
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
                          as={SlActionRedo}
                          fontSize="1.1rem"
                          color="white"
                        />

                        <Text>Edit recipes</Text>
                      </Flex>
                    </Button>
                  </Flex>
                </GridItem>
                <GridItem
                  borderRadius="xl"
                  height="115px"
                  display="flex"
                  justifyContent="center"
                  bg="gray.searchBoxGray"
                >
                  <Flex
                    direction="column"
                    justifyContent="center"
                    align="center"
                  >
                    <Text fontSize="md" fontWeight="600" mb={2}>
                      Delete plan
                    </Text>
                    <Button
                      height="3rem"
                      width="12rem"
                      colorScheme="red"
                      color={'white'}
                      fontSize="sm"
                      fontWeight="600"
                      onClick={() => {
                        onOpen();
                      }}
                    >
                      <Flex
                        justifyContent={'space-between'}
                        gap={'0.5rem'}
                        alignItems={'center'}
                      >
                        <Icon as={SlTrash} fontSize="1.1rem" color="white" />
                        <Text>Delete</Text>
                      </Flex>
                    </Button>
                  </Flex>
                </GridItem>
                <GridItem
                  borderRadius="xl"
                  height="115px"
                  display="flex"
                  justifyContent="center"
                  bg="gray.searchBoxGray"
                >
                  <Flex
                    direction="column"
                    justifyContent="center"
                    align="center"
                  >
                    <Text fontSize="md" fontWeight="600" mb={2}>
                      Share plan
                    </Text>
                    <Button
                      fontSize="sm"
                      colorScheme="brand"
                      fontWeight="600"
                      onClick={onCopyLink}
                      height="3rem"
                      width="12rem"
                    >
                      <Flex
                        justifyContent={'space-between'}
                        gap={'0.5rem'}
                        alignItems={'center'}
                      >
                        <Icon as={ImCopy} fontSize="1.1rem" color="white" />
                        <Text>Copy Link</Text>
                      </Flex>
                    </Button>
                  </Flex>
                </GridItem>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Flex gap={'1rem'} mb={'2rem'}>
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
        ></Grid>
      </Container>
    </Layout>
  );
};
MealPlan.requireAuth = false;
export default MealPlan;
