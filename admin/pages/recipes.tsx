import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  Select,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import Layout from '../components/layout';
import IngredientsSearchModal from '../components/modal/IngredientsSearchModal';
import InstructionsAddModal from '../components/modal/InstructionsAddModal';
import FilterCheckBox from '../components/recipes/FilterCheckBox';
import { useAuth } from '../contexts/auth-context';
import { RecipeWithIngredients } from '../types/recipe.types';
import { Supermarket } from '../types/supermarket.types';
import { calcPricePerServing } from '../utils/calcPricePerServing';
import { convertBoolObjToStringArray } from '../utils/convertBoolObjToStringArray';
import {
  freeFromDefaults,
  lifestyleDefaults,
  mealDefaults,
} from '../utils/filterDefaults';
import {
  deleteRecipe,
  getRecipes,
  insertRecipe,
} from '../utils/requests/recipes';
import { getSignedUploadUrl } from '../utils/requests/storage';
import { getSupermarkets } from '../utils/requests/supermarkets';
import { toTitleCase } from '../utils/toTitleCase';

// run import only on client
const Interweave = dynamic<any>(
  () => import('interweave').then((mod) => mod.Interweave),
  {
    ssr: false,
  },
);

const RecipeInstructionCard = ({
  indexPosition,
  instruction,
  onDelete,
}: {
  indexPosition: number;
  instruction: string;
  onDelete: (indexPosition: number) => void;
}) => {
  const step = indexPosition + 1;
  return (
    <Flex
      bg={'#ffffff'}
      border={'#cccccc'}
      justifyContent={'space-between'}
      alignItems={'center'}
      p={'1rem'}
    >
      <Flex gap={'1rem'}>
        <Box>
          <Text fontSize={'1rem'} fontWeight={100}>
            Step: {step}
          </Text>
          <Interweave content={instruction} />
        </Box>
      </Flex>
      <Button
        colorScheme="brandSecondary"
        onClick={() => onDelete(indexPosition)}
      >
        <FiTrash2 />
      </Button>
    </Flex>
  );
};

RecipeInstructionCard.displayName = 'RecipeInstructionCard';

const IngredientCard = React.forwardRef<any>(
  ({ ingredient, id, onChange, name, onDelete }, ref) => {
    return (
      <Flex
        bg={'#ffffff'}
        border={'#cccccc'}
        justifyContent={'space-between'}
        alignItems={'center'}
        p={'1rem'}
      >
        <Flex gap={'1rem'}>
          <Box>
            <Text fontSize={'1rem'} fontWeight={100}>
              Unit quantity
            </Text>
            <Input
              ref={ref}
              padding={0}
              height={'min-content'}
              fontSize={'1rem'}
              variant="outline"
              bg={'#ffffff'}
              type={'number'}
              step="any"
              maxW={'5rem'}
              id={id}
              name={name}
              onChange={onChange}
            />
          </Box>
          <Box>
            <Text fontSize={'1rem'} fontWeight={100}>
              Name
            </Text>
            <Text fontSize={'1rem'}>{ingredient?.name}</Text>
          </Box>
        </Flex>
        <Button
          colorScheme="brandSecondary"
          onClick={() => onDelete(ingredient.uid)}
        >
          <FiTrash2 />
        </Button>
      </Flex>
    );
  },
);

IngredientCard.displayName = 'IngredientCard';

const RecipeCard = ({
  recipe,
  onDelete,
}: {
  recipe: { id: number; name: string };
  onDelete: (recipeId: number) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Flex
      bg={'#ffffff'}
      border={'#cccccc'}
      justifyContent={'space-between'}
      alignItems={'center'}
      p={'1rem'}
    >
      <Flex gap={'1rem'}>
        <Box>
          <Text fontSize={'1rem'} fontWeight={100}>
            id
          </Text>

          <Text fontSize={'1rem'}>{recipe.id}</Text>
        </Box>

        <Box>
          <Text fontSize={'1rem'} fontWeight={100}>
            Name
          </Text>

          <Text fontSize={'1rem'}>{recipe.name}</Text>
        </Box>
      </Flex>
      <Button
        colorScheme="brandSecondary"
        onClick={() => {
          setIsLoading(true);
          onDelete(recipe.id);
        }}
        isLoading={isLoading}
      >
        <FiTrash2 />
      </Button>
    </Flex>
  );
};

const aldiRecipeImagePath = 'recipe_images/aldi';

export default function Recipes() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenInstructionsModal,
    onOpen: onOpenInstructionsModal,
    onClose: onCloseInstructionsModal,
  } = useDisclosure();
  const [disableIngredientsButton, setDisableIngredientsButton] =
    useState<boolean>(true);
  const [previewImage, setPreviewImage] = useState<any>(null);
  const [ingredients, setIngredients] = useState<any>([]); // represents viewable ingredients list
  const [recipeInstructions, setRecipeInstructions] = useState<any>([]);
  const [recipes, setRecipes] = useState<any>([]);
  const [filename, setFilename] = useState<string>('');
  const [contentType, setContentType] = useState<string>('');
  const [recipe, setRecipe] = useState<any>();
  const [offset, setOffset] = useState(0);
  const [totalCountRecipes, setTotalCountRecipes] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReady, setIsReady] = useState(false);
  const [selectedSupermarket, setSelectedSupermarket] =
    useState<Supermarket | null>(null);
  const [supermarkets, setSupermarkets] = useState<Array<Supermarket>>([]);
  const toast = useToast();
  const { currentUser, idToken, authLoading } = useAuth();
  const router = useRouter();

  const limit = 10;
  const showMore = recipes.length < totalCountRecipes;

  const [pricePerServing, setPricePerServing] = useState(0);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
  }, [authLoading, currentUser, router]);

  useEffect(() => {
    currentUser
      ?.getIdTokenResult()
      .then((decodedToken: any) => {
        if (!decodedToken?.claims?.roles?.includes('admin')) {
          router.push('/login');
        } else {
          setIsReady(true);
        }
      })
      .catch((e) => {
        router.push('/login');
      });
  }, [currentUser, router]);

  const signedUploadUrlQuery = useQuery({
    queryKey: [`signedUploadUrlQuery`],
    queryFn: () =>
      getSignedUploadUrl(
        idToken,
        `${aldiRecipeImagePath}/${filename}`,
        contentType,
        'public-read',
      ),
    refetchOnMount: false,
    enabled: false,
    staleTime: Infinity,
    onSuccess: (url: string) => {
      const file = getValues('file')[0];
      const namedFile = new File([file], filename, { type: contentType });
      imageUploadMutation.mutate({ url, body: namedFile });
    },
    onError: (error: string) => {
      toast({
        position: 'top',
        title: 'Error!',
        description: `An error occurred creating signed upload url: ${error}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const imageUploadMutation = useMutation({
    mutationFn: ({ url, body }: { url: string; body: any }) => {
      return fetch(url, {
        method: 'PUT',
        headers: {
          'x-amz-acl': 'public-read',
        },
        body,
      });
    },
    onSuccess: async (res: any) => {
      insertRecipeMutation.mutate({
        recipe: {
          ...recipe,
          imagePath: `/${aldiRecipeImagePath}/${filename}`,
        },
      });
    },
    onError: (error: string) => {
      toast({
        position: 'top',
        title: 'Error!',
        description: `An error occurred uploading image: ${error}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const insertRecipeMutation = useMutation({
    mutationFn: ({ recipe }: { recipe: RecipeWithIngredients }) => {
      return insertRecipe(idToken, recipe);
    },
    onSuccess: async (res: any) => {
      toast({
        position: 'top',
        title: 'Success!',
        description: 'Recipe created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      reset();
      setPreviewImage(null);
      setIngredients([]);
      setRecipeInstructions([]);
      setSupermarkets([]);
      recipesQuery.refetch();
      setPricePerServing(0);
    },
    onError: (error: string) => {
      toast({
        position: 'top',
        title: 'Error!',
        description: `An error occurred inserting recipe: ${error}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const recipesQuery = useQuery(
    ['recipes', offset, limit],
    () =>
      getRecipes({
        includeIngredientsWithRecipes: false,
        offset,
        limit,
      }),
    {
      enabled: isReady,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
      onSuccess: (data: any) => {
        setRecipes((current) => {
          if (offset === 0) {
            return data.recipes;
          }
          return [...current, ...data.recipes];
        });
        setTotalCountRecipes(data.totalCount);
      },
    },
  );

  useQuery(
    [`supermarkets`],
    () => {
      return getSupermarkets();
    },
    {
      enabled: isReady,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
      onSuccess: (data: Array<Supermarket>) => {
        setSupermarkets(data);
      },
    },
  );

  const deleteRecipeMutation = useMutation({
    mutationFn: ({ recipeId }: { recipeId: number }) => {
      return deleteRecipe(idToken, recipeId);
    },
    onSuccess: async (res: any) => {
      setRecipes((current) => {
        return current.filter((recipe) => recipe.id !== res.id);
      });

      setTotalCountRecipes((current) => current - 1);

      toast({
        position: 'top',
        title: 'Success!',
        description: `Recipe deleted`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error: string) => {
      toast({
        position: 'top',
        title: 'Error!',
        description: `An error occurred deleting recipe: ${error}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    clearErrors,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const { remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'ingredients', // unique name for your Field Array
  });

  // submit recipe
  const onSubmit = (data: any) => {
    const meals = convertBoolObjToStringArray(data.meals);
    const lifestyles = convertBoolObjToStringArray(data.lifestyles);
    const freeFroms = convertBoolObjToStringArray(data.freeFroms);

    const ingredientsFull = data.ingredients.map((ingredient, index) => {
      return {
        ...ingredient,
        ...ingredients[index],
      };
    });

    // price per serving is calculated with whole unit quantities of ingredients
    const pricePerServing = calcPricePerServing(
      ingredientsFull,
      data.baseServings,
    );
    const { file, ...newRecipe }: { file: any } = {
      ...data,
      meals,
      lifestyles,
      freeFroms,
      pricePerServing,
      ingredients: ingredientsFull.map((ingredient) => {
        const { id, unitQuantity } = ingredient;
        return {
          id,
          unitQuantity,
        };
      }),
      instructions: recipeInstructions.map(
        (instruction: any) => instruction.instruction, // store unstripped html string
      ),
    };

    setRecipe(newRecipe);
    // create a signed upload url
    signedUploadUrlQuery.refetch();
  };

  // show image upload preview
  const showPreview = (event) => {
    if (event.target.files.length > 0) {
      const { name, type } = event.target.files[0];
      var src = URL.createObjectURL(event.target.files[0]);
      setFilename(`${name}_${Date.now()}.png`);
      setContentType(type);
      setPreviewImage(src);
    }
  };

  // remove ingredient from viewable list
  const onRemoveIngredient = (uid: number) => {
    const index = ingredients.findIndex((ingredient) => ingredient.uid == uid);
    remove(index);
    setIngredients((current) => {
      return current.filter((ingredient) => ingredient.uid !== uid);
    });
  };

  // add ingredient to viewable list
  const onAddIngredient = (ingredient) => {
    setIngredients((current) => [
      ...current,
      {
        ...ingredient,
        uid: ingredient.id + current.length + Math.floor(Math.random() * 1000),
      },
    ]);
  };

  // remove instructions from viewable list
  const onRemoveInstructionsStep = (indexPosition: number) => {
    setRecipeInstructions((current: any) => {
      return current
        .slice(0, indexPosition)
        .concat(current.slice(indexPosition + 1));
    });
  };

  const onAddInstructionsStep = (stepCreationEvent: any) => {
    // steps in array are added sequentially
    setRecipeInstructions((current) => [
      ...current,
      {
        instruction: stepCreationEvent.richTextContent,
      },
    ]);
  };

  // remove recipe from viewable list
  const onRemoveRecipe = (recipeId: number) => {
    deleteRecipeMutation.mutate({ recipeId });
  };

  const handleSupermarketSelectChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // when user selects first supermarket
    if (event.target.value && !selectedSupermarket) {
      const supermarket = supermarkets.find(
        (sm) => sm.id === parseInt(event.target.value),
      );

      if (supermarket) {
        setSelectedSupermarket(supermarket);
        setDisableIngredientsButton(false);
      }

      return;
    }

    // when user selects a different supermarket after having selected one already
    if (
      selectedSupermarket &&
      event.target.value &&
      parseInt(event.target.value) !== selectedSupermarket.id
    ) {
      const supermarket = supermarkets.find(
        (sm) => sm.id === parseInt(event.target.value),
      );

      if (supermarket) {
        setSelectedSupermarket(supermarket);
        setIngredients([]);
        setDisableIngredientsButton(false);
        remove();
      }

      return;
    }

    // when user selects placeholder
    if (!event.target.value) {
      setSelectedSupermarket(null);
      setIngredients([]);
      setDisableIngredientsButton(true);
      remove();
    }
  };

  useEffect(() => {
    const newLoadingState =
      isSubmitting ||
      insertRecipeMutation.isLoading ||
      imageUploadMutation.isLoading ||
      (signedUploadUrlQuery.isLoading &&
        signedUploadUrlQuery.fetchStatus !== 'idle');

    setIsLoading(newLoadingState);
  }, [
    isSubmitting,
    insertRecipeMutation.isLoading,
    imageUploadMutation.isLoading,
    signedUploadUrlQuery.isLoading,
    signedUploadUrlQuery.fetchStatus,
  ]);

  React.useEffect(() => {
    const subscription = watch((data) => {
      if (
        data.ingredients?.length &&
        ingredients?.length &&
        data.ingredients?.length === ingredients?.length
      ) {
        const ingredientsFull = data?.ingredients.map((ingredient, index) => {
          return {
            ...ingredient,
            ...ingredients[index],
          };
        });

        if (ingredientsFull.length && data.baseServings) {
          const newPricePerServing = calcPricePerServing(
            ingredientsFull,
            data.baseServings,
          );
          setPricePerServing((prevPricePerServing) => {
            return newPricePerServing
              ? newPricePerServing
              : prevPricePerServing;
          });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [ingredients, watch]);

  return (
    <Layout>
      <Head>
        <title>Admin Dashboard | Plan and Eat Well</title>
      </Head>

      <main>
        {isReady && (
          <>
            {selectedSupermarket && (
              <IngredientsSearchModal
                onClose={onClose}
                isOpen={isOpen}
                onSubmit={onAddIngredient}
                selectedSupermarket={selectedSupermarket}
              />
            )}
            <InstructionsAddModal
              onClose={onCloseInstructionsModal}
              isOpen={isOpenInstructionsModal}
              onSubmit={onAddInstructionsStep}
              stepBeingAdded={recipeInstructions.length + 1}
            />

            <Container maxW={'auto'}>
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <Text fontSize="2xl" color={'#4D4D4D'} mb={'2rem'}>
                  New recipe
                </Text>

                <Flex justifyContent={'space-between'} gap={'2rem'}>
                  <Box flex={2}>
                    <Stack spacing={'1rem'} maxW={'30rem'} mb={'2rem'}>
                      <FormControl isInvalid={!!errors.name}>
                        <Text>Recipe name</Text>
                        <Input
                          variant="outline"
                          autoComplete="off"
                          bg={'#ffffff'}
                          id={'name'}
                          {...register('name', {
                            required: 'A recipe name is required',
                            maxLength: {
                              value: 200,
                              message: 'Must be less than 200 characters',
                            },
                          })}
                        />
                        <FormErrorMessage>
                          {errors.name && `${errors?.name.message}`}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.baseServings}>
                        <Text># base servings</Text>
                        <Input
                          variant="outline"
                          autoComplete="off"
                          bg={'#ffffff'}
                          id={'baseServings'}
                          {...register('baseServings', {
                            required: '# base servings is required',
                            max: {
                              value: 24,
                              message: 'Max number of base servings is 24',
                            },
                            min: {
                              value: 1,
                              message: 'Min number of base servings is 1',
                            },
                            valueAsNumber: true,
                          })}
                          type={'number'}
                        />
                        <FormErrorMessage>
                          {errors.baseServings &&
                            `${errors?.baseServings.message}`}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl>
                        <Text>Price per serving</Text>
                        <Input
                          variant="outline"
                          autoComplete="off"
                          bg={'#ffffff'}
                          value={pricePerServing}
                          type={'number'}
                          disabled
                        />
                      </FormControl>

                      <FormControl isInvalid={!!errors.prepTime}>
                        <Text>Recipe prep time (minutes)</Text>
                        <Input
                          variant="outline"
                          autoComplete="off"
                          bg={'#ffffff'}
                          id={'prepTime'}
                          {...register('prepTime', {
                            required:
                              'A prep time number for the recipe is required',
                            max: {
                              value: 120,
                              message: 'Max prep time is 120 minutes',
                            },
                            min: {
                              value: 1,
                              message: 'Min prep time is 1 minute',
                            },
                            valueAsNumber: true,
                          })}
                          type={'number'}
                        />
                        <FormErrorMessage>
                          {errors.prepTime && `${errors?.prepTime.message}`}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.cookTime}>
                        <Text>Recipe cook time (minutes)</Text>
                        <Input
                          variant="outline"
                          autoComplete="off"
                          bg={'#ffffff'}
                          id={'cookTime'}
                          {...register('cookTime', {
                            required:
                              'A cook time number for the recipe is required',
                            max: {
                              value: 120,
                              message: 'Max cook time is 120 minutes',
                            },
                            min: {
                              value: 1,
                              message: 'Min cook time is 1 minute',
                            },
                            valueAsNumber: true,
                          })}
                          type={'number'}
                        />
                        <FormErrorMessage>
                          {errors.cookTime && `${errors?.cookTime.message}`}
                        </FormErrorMessage>
                      </FormControl>

                      <Box>
                        <Text>Recipe image</Text>
                        <FormControl isInvalid={!!errors.file}>
                          <input
                            type={'file'}
                            {...register('file', {
                              validate: (value) => {
                                return value.length === 1
                                  ? true
                                  : 'A file is required';
                              },
                              onBlur: () => {
                                clearErrors('file');
                              },
                            })}
                            accept="image/*"
                            onChange={showPreview}
                          />
                          <FormErrorMessage>
                            {errors.file && `${errors.file.message}`}
                          </FormErrorMessage>
                        </FormControl>

                        <Image
                          sx={{ display: previewImage ? 'block' : 'none' }}
                          src={previewImage}
                          width={'200px'}
                          alt={'uploaded-image-preview'}
                        />
                      </Box>
                    </Stack>

                    <Box>
                      <Text>Meal type</Text>
                      <Flex flexWrap={'wrap'}>
                        {Object.keys(mealDefaults.meals).map((meal: string) => {
                          return (
                            <FilterCheckBox
                              key={meal}
                              label={toTitleCase(meal)}
                              id={meal}
                              isChecked={watch(`meals.${meal}`)}
                              {...register(`meals.${meal}`)}
                            />
                          );
                        })}
                      </Flex>
                    </Box>

                    <Box>
                      <Text>Lifestyle type</Text>
                      <Flex flexWrap={'wrap'}>
                        {Object.keys(lifestyleDefaults.lifestyles).map(
                          (lifestyle: string) => {
                            return (
                              <FilterCheckBox
                                key={lifestyle}
                                label={toTitleCase(lifestyle)}
                                id={lifestyle}
                                isChecked={watch(`lifestyles.${lifestyle}`)}
                                {...register(`lifestyles.${lifestyle}`)}
                              />
                            );
                          },
                        )}
                      </Flex>
                    </Box>

                    <Box>
                      <Text>Free From type</Text>
                      <Flex flexWrap={'wrap'}>
                        {Object.keys(freeFromDefaults.freeFroms).map(
                          (freeFrom: string) => {
                            return (
                              <FilterCheckBox
                                key={freeFrom}
                                label={toTitleCase(freeFrom)}
                                id={freeFrom}
                                isChecked={watch(`freeFroms.${freeFrom}`)}
                                {...register(`freeFroms.${freeFrom}`)}
                              />
                            );
                          },
                        )}
                      </Flex>
                    </Box>

                    <Box>
                      <FormControl isInvalid={!!errors.supermarketId}>
                        <Text>Supermarket name</Text>
                        <Select
                          autoComplete="off"
                          id={'supermarketId'}
                          placeholder="Select supermarket"
                          variant="outline"
                          bg={'#ffffff'}
                          {...register('supermarketId', {
                            required: 'Supermarket is required',
                            valueAsNumber: true,
                          })}
                          onChange={handleSupermarketSelectChange}
                        >
                          {supermarkets.map((supermarket) => {
                            return (
                              <option
                                key={supermarket.id}
                                value={supermarket.id}
                              >
                                {supermarket.name}
                              </option>
                            );
                          })}
                        </Select>
                        <FormErrorMessage>
                          {errors.supermarketId &&
                            `${errors?.supermarketId.message}`}
                        </FormErrorMessage>
                      </FormControl>
                    </Box>

                    <Stack>
                      <Text fontSize={'2xl'} color={'#4D4D4D'} mb={'0rem'}>
                        Ingredients ({ingredients.length})
                      </Text>
                      <Stack pb={'0rem'}>
                        {ingredients.map((ingredient, index) => {
                          const error = errors.ingredients?.length
                            ? errors.ingredients[index] ?? false
                            : false;

                          return (
                            <FormControl isInvalid={error} key={ingredient.uid}>
                              <IngredientCard
                                ingredient={ingredient}
                                {...register(
                                  `ingredients.${index}.unitQuantity`,
                                  {
                                    required: 'A unit quantity is required',
                                    min: {
                                      value: 0.001,
                                      message:
                                        'Unit quantity must be greater than 0',
                                    },
                                    max: {
                                      value: 50,
                                      message:
                                        'Unit quantity must not be greater than 50',
                                    },
                                    valueAsNumber: true,
                                  },
                                )}
                                onDelete={onRemoveIngredient}
                              />

                              <FormErrorMessage>
                                {error.unitQuantity &&
                                  `${error.unitQuantity.message}`}
                              </FormErrorMessage>
                            </FormControl>
                          );
                        })}
                      </Stack>

                      <Button
                        colorScheme="brandSecondary"
                        onClick={onOpen}
                        disabled={disableIngredientsButton}
                      >
                        <FiPlus /> Add ingredients
                      </Button>
                    </Stack>

                    <Stack>
                      <Text fontSize={'2xl'} color={'#4D4D4D'} mt={'2rem'}>
                        Recipe instructions steps ({recipeInstructions.length})
                      </Text>
                      <Stack pb={'0rem'}>
                        {recipeInstructions.map(
                          (instruction: any, index: number) => {
                            return (
                              <Box key={index}>
                                <RecipeInstructionCard
                                  indexPosition={index}
                                  instruction={instruction.instruction}
                                  onDelete={onRemoveInstructionsStep}
                                />
                              </Box>
                            );
                          },
                        )}
                      </Stack>

                      <Button
                        colorScheme="brandSecondary"
                        onClick={onOpenInstructionsModal}
                      >
                        <FiPlus /> Add instruction step{' '}
                        {recipeInstructions.length + 1}
                      </Button>
                    </Stack>
                  </Box>
                  <Box flex={1} minW={'10rem'}>
                    <Box border={'solid 1px #cccccc'} p={'1rem'} bg={'#ffffff'}>
                      <Text fontSize={'2xl'} mb={'1rem'}>
                        Publish
                      </Text>
                      <Text mb={'1rem'}>Visibility: Public</Text>
                      <Button
                        colorScheme={'brandSecondary'}
                        type="submit"
                        isLoading={isLoading}
                      >
                        Publish
                      </Button>
                    </Box>
                  </Box>
                </Flex>
              </form>

              <Box mt={'2rem'}>
                <Text fontSize="2xl" color={'#4D4D4D'} mb={'2rem'}>
                  Recipes ({recipes.length})
                </Text>

                <Flex justifyContent={'space-between'} gap={'2rem'}>
                  <Box flex={2}>
                    <Stack pb={'2rem'}>
                      {recipes.map((recipe: any) => {
                        return (
                          <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onDelete={onRemoveRecipe}
                          />
                        );
                      })}
                    </Stack>
                  </Box>
                </Flex>

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
              </Box>
            </Container>
          </>
        )}
      </main>
    </Layout>
  );
}
