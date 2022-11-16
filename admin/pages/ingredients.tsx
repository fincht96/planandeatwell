import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiTrash2 } from 'react-icons/fi';
import Layout from '../components/layout';
import {
  deleteIngredient,
  getIngredients,
  insertIngredient,
} from '../utils/requests/ingredients';

import { Ingredient } from '../types/ingredient.types';

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
  const [ingredients, setIngredients] = useState<Array<Ingredient>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const recipesQuery = useQuery(['ingredients'], () => getIngredients(), {
    refetchOnMount: 'always',
    staleTime: Infinity,
    onSuccess: (data: any) => {
      setIngredients(data);
    },
  });

  const insertIngredientMutation = useMutation({
    mutationFn: ({ ingredient }: { ingredient: Ingredient }) => {
      return insertIngredient(ingredient);
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
      recipesQuery.refetch();
    },
    onError: (error) => {
      toast({
        position: 'top',
        title: 'Error!',
        description: 'An error occurred inserting ingredient',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const deleteIngredientMutation = useMutation({
    mutationFn: ({ ingredientId }: { ingredientId: number }) => {
      return deleteIngredient(ingredientId);
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
    onError: (error) => {
      toast({
        position: 'top',
        title: 'Error!',
        description: 'An error occurred deleting ingredient',
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
    watch,
    control,
    unregister,
    clearErrors,
    getValues,
    reset,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();

  // submit ingredient
  const onSubmit = (data) => {
    insertIngredientMutation.mutate({ ingredient: data });
  };

  return (
    <Layout>
      <Head>
        <title>Admin Dashboard | Plan and Eat Well</title>
      </Head>

      <main>
        <Container maxW={'auto'}>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Text fontSize="2xl" color={'#4D4D4D'} mb={'2rem'}>
              New Ingredient
            </Text>

            <Flex justifyContent={'space-between'} gap={'2rem'}>
              <Box flex={2}>
                <Stack spacing={'1rem'} maxW={'30rem'} mb={'2rem'}>
                  <FormControl isInvalid={!!errors.name}>
                    <Text>Name</Text>
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
                    <Text>Price per unit</Text>
                    <Input
                      variant="outline"
                      autoComplete="off"
                      bg={'#ffffff'}
                      id={'pricePerUnit'}
                      type={'number'}
                      step="any"
                      {...register('pricePerUnit', {
                        required: 'pricePerUnit is required',
                        max: {
                          value: 100,
                          message: 'Max price is 100',
                        },
                        min: {
                          value: 0,
                          message: 'Max price is 0',
                        },
                        valueAsNumber: true,
                      })}
                    />
                    <FormErrorMessage>
                      {errors.pricePerUnit && `${errors?.pricePerUnit.message}`}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.productId}>
                    <Text>Product id</Text>
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
      </main>
    </Layout>
  );
}
