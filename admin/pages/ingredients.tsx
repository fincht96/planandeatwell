import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiTrash2 } from 'react-icons/fi';
import Layout from '../components/layout';
import { getCategories } from '../utils/requests/categories';
import {
  deleteIngredient,
  getIngredients,
  insertIngredient,
  updateIngredientPrices,
} from '../utils/requests/ingredients';
import { getSupermarkets } from '../utils/requests/supermarkets';

import { useRouter } from 'next/router';
import { useAuth } from '../contexts/auth-context';
import { Category } from '../types/category.types';
import { Ingredient } from '../types/ingredient.types';
import { Supermarket } from '../types/supermarket.types';

const IngredientCard = ({
  ingredient,
  onDelete,
}: {
  ingredient: { id: number; name: string; productId: string };
  onDelete: (ingredientId: number) => void;
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
      <Flex gap={'2rem'}>
        <Box>
          <Text fontSize={'1rem'} fontWeight={100}>
            id
          </Text>

          <Text fontSize={'1rem'}>{ingredient.id}</Text>
        </Box>

        <Box>
          <Text fontSize={'1rem'} fontWeight={100}>
            Product id
          </Text>

          <Text fontSize={'1rem'}>{ingredient.productId}</Text>
        </Box>

        <Box>
          <Text fontSize={'1rem'} fontWeight={100}>
            Name
          </Text>

          <Text fontSize={'1rem'}>{ingredient.name}</Text>
        </Box>
      </Flex>
      <Button
        colorScheme="brandSecondary"
        onClick={() => {
          setIsLoading(true);
          onDelete(ingredient.id);
        }}
        isLoading={isLoading}
      >
        <FiTrash2 />
      </Button>
    </Flex>
  );
};

IngredientCard.displayName = 'IngredientCard';

export default function Ingredients() {
  const [showCustomunitField, setShowCustomunitField] =
    useState<boolean>(false);
  const { currentUser, idToken, authLoading } = useAuth();
  const [ingredients, setIngredients] = useState<Array<Ingredient>>([]);
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [supermarkets, setSupermarkets] = useState<Array<Supermarket>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);

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

  const ingredientsQuery = useQuery(
    [`ingredients`],
    () => {
      return getIngredients();
    },
    {
      enabled: isReady,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
      onSuccess: (data: any) => {
        setIngredients(data);
      },
    },
  );

  useQuery(
    [`categories`],
    () => {
      return getCategories();
    },
    {
      enabled: isReady,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
      onSuccess: (data: Array<Category>) => {
        setCategories(data);
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

  const insertIngredientMutation = useMutation({
    mutationFn: ({ ingredient }: { ingredient: Ingredient }) => {
      return insertIngredient(idToken, ingredient);
    },
    onSuccess: async (res: any) => {
      toast({
        position: 'top',
        title: 'Success!',
        description: 'Ingredient created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      reset();
      ingredientsQuery.refetch();
    },
    onError: (error: string) => {
      toast({
        position: 'top',
        title: 'Error!',
        description: `An error occurred inserting ingredient: ${error}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const deleteIngredientMutation = useMutation({
    mutationFn: ({ ingredientId }: { ingredientId: number }) => {
      return deleteIngredient(idToken, ingredientId);
    },
    onSuccess: async (res: any) => {
      setIngredients((current) => {
        return current.filter((ingredient) => ingredient.id !== res.id);
      });

      toast({
        position: 'top',
        title: 'Success!',
        description: `Ingredient deleted`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error: string) => {
      toast({
        position: 'top',
        title: 'Error!',
        description: `An error occurred deleting ingredient: ${error}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  // remove ingredient from viewable list
  const onRemoveIngredient = (ingredientId: number) => {
    deleteIngredientMutation.mutate({ ingredientId });
  };

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm({
    shouldUnregister: true, // when input is unmounted the field should be removed i.e. customUnit should be removed on unmount
  });

  const handleUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      resetField('customUnit');
      setShowCustomunitField(false);
      return;
    }

    if (event.target.value && event.target.value === 'create custom unit') {
      clearErrors('unit');
      setShowCustomunitField(true);
    } else {
      // submit the chosen traditional unit
      clearErrors('unit');
      resetField('customUnit');
      setShowCustomunitField(false);
    }
  };

  // submit ingredient
  const onSubmit = (data: any): void => {
    if (data.customUnit) {
      data.unit = data.customUnit;
      delete data.customUnit;
    }
    insertIngredientMutation.mutate({ ingredient: data });
  };

  const updateLatestIngredientPrices = () => {
    setIsLoading(true);
    const aldiSuperMarketId = 1;
    updateIngredientPrices(idToken, aldiSuperMarketId)
      .then(() => {
        toast({
          position: 'top',
          title: 'Success!',
          description: `Ingredient prices updated`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((e) => {
        toast({
          position: 'top',
          title: 'Error!',
          description: `Error updating ingredient prices`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Layout>
      <Head>
        <title>Admin Dashboard | Plan and Eat Well</title>
      </Head>

      <main>
        {isReady && (
          <Container maxW={'auto'}>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <Text fontSize="2xl" color={'#4D4D4D'} mb={'2rem'}>
                New Ingredient
              </Text>

              <Flex justifyContent={'space-between'} gap={'2rem'}>
                <Box flex={2}>
                  <Stack spacing={'1rem'} maxW={'30rem'} mb={'2rem'}>
                    <Button
                      colorScheme={'blue'}
                      onClick={() => updateLatestIngredientPrices()}
                      isLoading={isLoading}
                    >
                      Update ingredient prices
                    </Button>
                    <FormControl isInvalid={!!errors.name}>
                      <FormLabel>Name</FormLabel>
                      <Input
                        variant="outline"
                        autoComplete="off"
                        bg={'#ffffff'}
                        id={'name'}
                        {...register('name', {
                          required: 'An ingredient name is required',
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

                    <FormControl isInvalid={!!errors.pricePerUnit}>
                      <FormLabel>Price per unit</FormLabel>
                      <Input
                        variant="outline"
                        autoComplete="off"
                        bg={'#ffffff'}
                        id={'pricePerUnit'}
                        type={'number'}
                        step="any"
                        {...register('pricePerUnit', {
                          required: 'Price per unit is required',
                          max: {
                            value: 100,
                            message: 'Max price is 100',
                          },
                          min: {
                            value: 0,
                            message: 'Min price is 0',
                          },
                          valueAsNumber: true,
                        })}
                      />
                      <FormErrorMessage>
                        {errors.pricePerUnit &&
                          `${errors?.pricePerUnit.message}`}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.productId}>
                      <FormLabel>Product id</FormLabel>
                      <Input
                        variant="outline"
                        autoComplete="off"
                        bg={'#ffffff'}
                        id={'productId'}
                        type={'number'}
                        step="1"
                        {...register('productId', {
                          required: 'Product id is required',
                          min: {
                            value: 0,
                            message: 'Min product id is 0',
                          },
                          valueAsNumber: true,
                        })}
                      />
                      <FormErrorMessage>
                        {errors.productId && `${errors?.productId.message}`}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.baseValue}>
                      <FormLabel>Base unit value for ingredient</FormLabel>
                      <Input
                        variant="outline"
                        autoComplete="off"
                        bg={'#ffffff'}
                        id={'baseValue'}
                        type={'number'}
                        step="any"
                        {...register('baseValue', {
                          required: 'Base value of ingredient is required',
                          max: {
                            value: 10000,
                            message: 'Max base value is 10000',
                          },
                          min: {
                            value: 1,
                            message: 'Min base value is 1',
                          },
                          valueAsNumber: true,
                        })}
                      />
                      <FormErrorMessage>
                        {errors.baseValue && `${errors?.baseValue.message}`}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.unit}>
                      <FormLabel>Unit of measurement</FormLabel>
                      <Select
                        autoComplete="off"
                        id={'unit'}
                        placeholder="Select unit of measurement"
                        variant="outline"
                        bg={'#ffffff'}
                        {...register('unit', {
                          required: 'Unit of measurement is required',
                        })}
                        onChange={handleUnitChange}
                      >
                        {[
                          'kilogram',
                          'gram',
                          'milliliter',
                          'liter',
                          'create custom unit',
                        ].map((unit, index) => {
                          return (
                            <option key={index} value={unit}>
                              {unit}
                            </option>
                          );
                        })}
                      </Select>
                      <FormErrorMessage>
                        {errors.unit && `${errors?.unit.message}`}
                      </FormErrorMessage>
                    </FormControl>
                    {showCustomunitField && (
                      <FormControl isInvalid={!!errors.customUnit}>
                        <FormLabel>Custom unit of measurement</FormLabel>
                        <Input
                          variant="outline"
                          autoComplete="off"
                          bg={'#ffffff'}
                          id={'customUnit'}
                          {...register('customUnit', {
                            required:
                              'Please provide a custom unit of measurement i.e. pepper',
                            minLength: {
                              value: 1,
                              message: `Must be more than 1 character`,
                            },
                            maxLength: {
                              value: 50,
                              message: 'Must be less than 50 characters',
                            },
                            pattern: /^[a-zA-Z]+$/,
                          })}
                        />
                        <FormErrorMessage>
                          {errors?.customUnit?.type === 'required' &&
                            `${errors?.customUnit.message}`}
                          {errors?.customUnit?.type === 'pattern' &&
                            'you must provide letters only and ensure there is only one word'}
                        </FormErrorMessage>
                      </FormControl>
                    )}

                    <FormControl isInvalid={!!errors.categoryId}>
                      <FormLabel>Category name</FormLabel>
                      <Select
                        autoComplete="off"
                        id={'categoryId'}
                        placeholder="Select category name"
                        variant="outline"
                        bg={'#ffffff'}
                        {...register('categoryId', {
                          required: 'Category name is required',
                          valueAsNumber: true,
                        })}
                      >
                        {categories.map((category) => {
                          return (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          );
                        })}
                      </Select>
                      <FormErrorMessage>
                        {errors.categoryId && `${errors?.categoryId.message}`}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.supermarketId}>
                      <FormLabel>Supermarket name</FormLabel>
                      <Select
                        autoComplete="off"
                        id={'supermarketId'}
                        placeholder="Select supermarket name"
                        variant="outline"
                        bg={'#ffffff'}
                        {...register('supermarketId', {
                          required: 'Supermarket name is required',
                          valueAsNumber: true,
                        })}
                      >
                        {supermarkets.map((supermarket) => {
                          return (
                            <option key={supermarket.id} value={supermarket.id}>
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

            <Stack pb={'2rem'}>
              <Text fontSize={'2xl'} color={'#4D4D4D'} mb={'1rem'}>
                Ingredients ({ingredients.length})
              </Text>

              {ingredients.map((ingredient: any) => {
                return (
                  <IngredientCard
                    key={ingredient.id}
                    ingredient={ingredient}
                    onDelete={onRemoveIngredient}
                  />
                );
              })}
            </Stack>
          </Container>
        )}
      </main>
    </Layout>
  );
}
