import {
  Box,
  Button,
  Container,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Grid,
  Icon,
  Link,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { FiLink2 } from 'react-icons/fi';
import { MdModeEdit } from 'react-icons/md';
import { SiMinutemailer } from 'react-icons/si';
import Layout from '../../components/layout';
import { getRecipePlan } from '../../utils/requests/recipe-plans';

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

      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <Box>{summary[0]}</Box>
        <Box>{summary[1]}</Box>
      </Flex>
    </Box>
  );
};

const RecipePlan: NextPage = () => {
  const toast = useToast();
  const router = useRouter();
  const recipePlanUuid =
    typeof router.query.id === 'string' ? router.query.id : '';

  useQuery(
    {
      queryKey: [`recipesQuery-${recipePlanUuid}`],
      queryFn: () => getRecipePlan(recipePlanUuid, true),
      refetchOnMount: false,
      staleTime: Infinity,
      enabled: !!recipePlanUuid.length,
      onSuccess: (data) => {
        const ingredients = data[0].ingredients.map((ing) => {
          const quantity = Math.ceil(ing.quantity);
          const price = ing.pricePerUnit * quantity;
          return { ...ing, quantity, price };
        });

        setRecipes(data[0].recipes);
        setIngredients(ingredients);
      },
    },

    // {
    //   refetchOnMount: false,
    //   staleTime: Infinity,
    //   enabled: !!recipePlanUuid.length,
    // },
  );

  const [ingredients, setIngredients] = useState<
    Array<{ id: number; name: string; price: number; quantity: number }>
  >([]);

  const [recipes, setRecipes] = useState<
    Array<{ id: number; name: string; servings: number; link: string }>
  >([]);

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

  return (
    <Layout>
      <Head>
        <title>Recipe Plan | Plan and Eat Well</title>
      </Head>

      <Container my={'5rem'} w={'95vw'} maxW={'1100px'} pt={'4rem'}>
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={'1rem'}
          mb={'2rem'}
        >
          <Editable
            fontSize={{ base: '1.25rem', md: '1.5rem' }}
            color="gray.dark"
            fontWeight={600}
            defaultValue="Aldi - Recipe Plan #1"
            onChange={(textValue: string) => {
              console.log(textValue);
            }}
            flexGrow={1}
            selectAllOnFocus={false}
          >
            <EditablePreview
              _hover={{
                background: 'gray.100',
              }}
            />

            <EditableInput />
          </Editable>

          <Button
            bg={'#ffffff'}
            border={'solid 1px'}
            borderColor={'brand.500'}
            color={'brand.500'}
            fontSize={'1rem'}
            fontWeight={400}
            minW={'min-content'}
            display={{ base: 'none', md: 'block' }}
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
          <Button
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
          </Button>
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
            summary={[
              <Text
                fontWeight={'600'}
                color={'#4d4d4d'}
                fontSize={{ base: '0.9rem', md: '1rem' }}
              >
                Total price
              </Text>,
              <Text
                fontWeight={'600'}
                color={'#4d4d4d'}
                fontSize={{ base: '0.9rem', md: '1rem' }}
              >
                £{totalPrice.toFixed(2)}
              </Text>,
            ]}
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
              summary={[
                <Text
                  fontWeight={'600'}
                  color={'#4d4d4d'}
                  fontSize={{ base: '0.9rem', md: '1rem' }}
                >
                  Servings
                </Text>,
                <Text
                  fontWeight={'600'}
                  color={'#4d4d4d'}
                  fontSize={{ base: '0.9rem', md: '1rem' }}
                >
                  {totalServings}
                </Text>,
              ]}
            />
          </Box>
        </Grid>
      </Container>
    </Layout>
  );
};

export default RecipePlan;
