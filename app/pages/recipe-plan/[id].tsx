import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Icon,
  Link,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiLink2 } from 'react-icons/fi';
import Editable from '../../components/Editable';
import Layout from '../../components/layout';
import {
  getRecipePlan,
  updateRecipePlan,
} from '../../utils/requests/recipe-plans';

const ContentBox = ({
  title,
  rows,
  summary,
}: {
  title: any;
  rows: Array<any>;
  summary: any;
}) => {
  return (
    <Box
      p={'1rem 1.5rem'}
      border={'solid #CCCCCC 1px'}
      background={'#ffffff'}
      width={'100%'}
      maxH={'min-content'}
    >
      <Text
        fontSize={{ base: '1rem', md: '1.2rem' }}
        color="gray.dark"
        fontWeight={600}
        mb={'1rem'}
      >
        {title}
      </Text>

      {rows.map((row) => {
        return (
          <Box mb={'1rem'} key={row.id}>
            {row.content}
          </Box>
        );
      })}

      <Box my={'1rem'}>
        <Divider />
      </Box>

      <Box>{summary}</Box>
    </Box>
  );
};

const RecipePlan: NextPage = () => {
  const toast = useToast();
  const router = useRouter();
  const recipePlanUuid =
    typeof router.query.id === 'string' ? router.query.id : '';

  const [recipePlanName, setRecipePlanName] = useState<string>('');

  const recipeQuery = useQuery({
    queryKey: [`recipesQuery-${recipePlanUuid}`],
    queryFn: () => getRecipePlan(recipePlanUuid, true),
    refetchOnMount: 'always',
    staleTime: Infinity,
    enabled: !!recipePlanUuid.length,
  });

  const recipePlanMutation = useMutation({
    mutationFn: ({ recipePlanName }: { recipePlanName: string }) => {
      return updateRecipePlan(recipePlanUuid, { name: recipePlanName });
    },
    onSuccess: (data) => {
      setRecipePlanName(data.name);
    },
  });

  const recipes: Array<{
    id: number;
    name: string;
    servings: number;
    link: string;
  }> = useMemo(() => {
    return !recipeQuery.isLoading && !recipeQuery.error
      ? recipeQuery.data[0].recipes
      : [];
  }, [recipeQuery.data, recipeQuery.isLoading, recipeQuery.error]);

  const ingredients: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }> = useMemo(() => {
    return !recipeQuery.isLoading && !recipeQuery.error
      ? recipeQuery.data[0].ingredients.map((ing) => {
          const quantity = Math.ceil(ing.quantity);
          const price = ing.pricePerUnit * quantity;
          return { ...ing, quantity, price };
        })
      : [];
  }, [recipeQuery.data, recipeQuery.isLoading, recipeQuery.error]);

  const onNavigate = (pathname: string, query: any) => {
    router.push({ pathname, query });
  };

  const totalServings = useMemo(() => {
    return recipes.reduce((prev, current) => {
      return prev + current.servings;
    }, 0);
  }, [recipes]);

  const totalPrice = useMemo(() => {
    return ingredients.reduce((prev, current) => {
      return prev + current.price;
    }, 0);
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
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({});

  const onSubmit: SubmitHandler<any> = (data, closeEditing) => {
    if (data.recipePlanName !== recipePlanName) {
      recipePlanMutation.mutate({
        recipePlanName: data.recipePlanName,
      });
    }
    closeEditing();
  };

  useEffect(() => {
    if (!recipeQuery.isLoading && !recipeQuery.error) {
      setRecipePlanName(recipeQuery.data[0].recipePlanName);
      setValue('recipePlanName', `${recipeQuery.data[0].recipePlanName}`);
    }
  }, [recipeQuery.data, recipeQuery.isLoading, recipeQuery.error, setValue]);

  return (
    <Layout>
      <Head>
        <title>Recipe Plan | Plan and Eat Well</title>
      </Head>

      <Container my={'2rem'} w={'95vw'} maxW={'1100px'} pt={'4rem'}>
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={'5rem'}
          mb={'2rem'}
        >
          <Box flex={1}>
            <Editable
              previewValue={recipePlanName}
              handleSubmit={(e, closeEditing) => {
                handleSubmit((d) => onSubmit(d, closeEditing))(e);
              }}
              {...register('recipePlanName', {
                required: 'A name is required',
                maxLength: {
                  value: 199,
                  message: 'Must be less than 200 characters',
                },
              })}
              resetForm={() => {
                reset({ recipePlanName });
              }}
              error={{
                isError: !!errors.recipePlanName,
                message: errors.recipePlanName?.message,
              }}
              name={'recipePlanName'}
            />
          </Box>

          {/* <Button
            bg={'#ffffff'}
            border={'solid 1px'}
            borderColor={'brand.500'}
            color={'brand.500'}
            fontSize={'1rem'}
            fontWeight={400}
            minW={'min-content'}
            display={{ base: 'none', md: 'block' }}
            onClick={() => {
              onNavigate('/menu', {
                supermarket: 'aldi',
                servings: 4,
                recipe_plan_uuid: recipePlanUuid,
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
          </Button> */}
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
          {/* <Button
            bg={'#ffffff'}
            border={'solid 1px'}
            borderColor={'#cccccc'}
            color={'#4d4d4d'}
            fontSize={{ base: '0.9rem', md: '1rem' }}
            fontWeight={400}
            minW={'content'}
          >
            <Flex
              justifyContent={'space-between'}
              gap={'0.5rem'}
              alignItems={'center'}
            >
              <Icon
                as={SiMinutemailer}
                width={{ base: '1.5rem' }}
                height={{ base: '1.5rem' }}
                color={'#4d4d4d'}
              />

              <Text>Email recipe plan</Text>
            </Flex>
          </Button> */}
        </Flex>

        <Grid
          templateColumns={{
            base: '1fr',
            md: '1fr 0.5fr',
          }}
          gap={6}
        >
          <ContentBox
            title={
              <Text as={'span'}>
                Ingredients{' '}
                <Text as={'span'} fontWeight={200}>
                  ({ingredients.length})
                </Text>
              </Text>
            }
            rows={ingredients.map((ingredient) => ({
              id: ingredient.id,
              content: (
                <Flex justifyContent={'space-between'} gap={'1rem'}>
                  <Text
                    color={'#444444'}
                    fontSize={{ base: '0.9rem', md: '1rem' }}
                  >
                    {ingredient.quantity}x {ingredient.name}
                  </Text>

                  <Text
                    color={'#444444'}
                    fontSize={{ base: '0.9rem', md: '1rem' }}
                  >
                    £{ingredient.price.toFixed(2)}
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
            }
          />

          <Box>
            <ContentBox
              title={
                <Text as={'span'}>
                  Recipes{' '}
                  <Text as={'span'} fontWeight={200}>
                    ({recipes.length})
                  </Text>
                </Text>
              }
              rows={recipes.map((recipe) => ({
                id: recipe.id,
                content: (
                  <Flex justifyContent={'space-between'} gap={'1rem'}>
                    <Text
                      color={'#444444'}
                      as={Link}
                      sx={{ textDecoration: 'underline' }}
                      _hover={{ color: 'brand.500' }}
                      href={recipe.link}
                      isExternal
                      fontSize={{ base: '0.9rem', md: '1rem' }}
                    >
                      1x {recipe.name}
                    </Text>

                    <Text
                      color={'#444444'}
                      fontSize={{ base: '0.9rem', md: '1rem' }}
                    >
                      {recipe.servings} servings
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

export default RecipePlan;
