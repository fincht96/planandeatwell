import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import Layout from '../components/layout';
import IngredientsSearchModal from '../components/modal/IngredientsSearchModal';
import { RecipeWithIngredients } from '../types/recipe.types';
import { calcPricePerServing } from '../utils/price-per-serving';
import { insertRecipe } from '../utils/requests/recipes';
import { getSignedUploadUrl } from '../utils/requests/storage';

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

const aldiRecipeImagePath = 'recipe_images/aldi';

export default function NewRecipe() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [previewImage, setPreviewImage] = useState<any>(null);
  const [ingredients, setIngredients] = useState<any>([]); // represents viewable ingredients list
  const [filename, setFilename] = useState<string>('');
  const [contentType, setContentType] = useState<string>('');
  const [recipe, setRecipe] = useState<any>();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signedUploadUrlQuery = useQuery({
    queryKey: [`signedUploadUrlQuery`],
    queryFn: () =>
      getSignedUploadUrl(
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
    onError: (err: any) => {
      toast({
        position: 'top',
        title: 'Error!',
        description: 'An error occurred creating signed upload url',
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
    onError: (error) => {
      toast({
        position: 'top',
        title: 'Error!',
        description: 'An error occurred uploading image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const insertRecipeMutation = useMutation({
    mutationFn: ({ recipe }: { recipe: RecipeWithIngredients }) => {
      return insertRecipe(recipe);
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
    },
    onError: (error) => {
      toast({
        position: 'top',
        title: 'Error!',
        description: 'An error occurred inserting recipe',
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
    unregister,
    clearErrors,
    getValues,
    reset,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: 'ingredients', // unique name for your Field Array
    },
  );

  // submit recipe
  const onSubmit = (data) => {
    const ingredientsFull = data.ingredients.map((ingredient, index) => {
      return {
        ...ingredient,
        ...ingredients[index],
      };
    });

    const pricePerServing = calcPricePerServing(ingredientsFull, data.servings);
    const { file, ...newRecipe }: { file: any } = {
      ...data,
      pricePerServing,
      ingredients: ingredientsFull.map((ingredient, index) => {
        const { id, unitQuantity } = ingredient;
        return {
          id,
          unitQuantity,
        };
      }),
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

  // addd ingredient to viewable list
  const onAddIngredient = (ingredient) => {
    setIngredients((current) => [
      ...current,
      {
        ...ingredient,
        uid: ingredient.id + current.length + Math.floor(Math.random() * 1000),
      },
    ]);
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

  return (
    <Layout>
      <Head>
        <title>Admin Dashboard | Plan and Eat Well</title>
      </Head>

      <main>
        <IngredientsSearchModal
          onClose={onClose}
          isOpen={isOpen}
          onSubmit={onAddIngredient}
        />

        <Container maxW={'auto'}>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Text fontSize="4xl" color={'#4D4D4D'} mb={'2rem'}>
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

                  <FormControl isInvalid={!!errors.servings}>
                    <Text># servings</Text>
                    <Input
                      variant="outline"
                      autoComplete="off"
                      bg={'#ffffff'}
                      id={'servings'}
                      {...register('servings', {
                        required: '# servings is required',
                        max: {
                          value: 24,
                          message: 'Max number of servings is 24',
                        },
                        min: {
                          value: 1,
                          message: 'Min number of servings is 1',
                        },
                        valueAsNumber: true,
                      })}
                      type={'number'}
                    />
                    <FormErrorMessage>
                      {errors.servings && `${errors?.servings.message}`}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.link}>
                    <Text>Recipe link</Text>
                    <Input
                      variant="outline"
                      autoComplete="off"
                      bg={'#ffffff'}
                      id={'link'}
                      {...register('link', {
                        required: 'A recipe link is required',
                        maxLength: {
                          value: 500,
                          message: 'Must be less than 500 characters',
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.link && `${errors?.link.message}`}
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

                <Stack>
                  <Text fontSize={'2xl'} mb={'1rem'}>
                    Ingredients({ingredients.length})
                  </Text>

                  <Stack pb={'2rem'}>
                    {ingredients.map((ingredient, index) => {
                      const error = errors.ingredients?.length
                        ? errors.ingredients[index] ?? false
                        : false;

                      return (
                        <FormControl isInvalid={error} key={ingredient.uid}>
                          <IngredientCard
                            ingredient={ingredient}
                            {...register(`ingredients.${index}.unitQuantity`, {
                              required: 'A unit quantity is required',
                              min: {
                                value: 0.001,
                                message: 'Unit quantity must be greater than 0',
                              },
                              max: {
                                value: 50,
                                message:
                                  'Unit quantity must not be greater than 50',
                              },
                              valueAsNumber: true,
                            })}
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

                  <Button colorScheme="brandSecondary" onClick={onOpen}>
                    <FiPlus />
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
        </Container>
      </main>
    </Layout>
  );
}
