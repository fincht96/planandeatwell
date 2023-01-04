import type { NextPage } from 'next';
import Head from 'next/head';
import Layout, { siteTitle } from '../../components/layout';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Text,
  useMediaQuery,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
  Badge,
} from '@chakra-ui/react';
import { getRecipes } from '../../utils/api-requests/recipes';
import Image from 'next/image';
import BorderBox from '../../components/BorderBox';
import dynamic from 'next/dynamic';
import getSupermarketBrandColor from '../../utils/getSupermarketBrandColor';

// run import only on client
const Interweave = dynamic<any>(
  () => import('interweave').then((mod) => mod.Interweave),
  {
    ssr: false,
  },
);

const Recipe: NextPage = ({ recipe }: any) => {
  const updatedSiteTitle = `Recipe | ${siteTitle}`;
  const [isLessThan900] = useMediaQuery('(max-width: 900px)');

  const showRecipeMobile = () => {
    return (
      <>
        <Container maxW="1200px">
          <Grid templateColumns="repeat(1, 1fr);" gap={2}>
            <GridItem w="100%" h="100">
              <Box display={'flex'} flexDirection={'column'}>
                <BorderBox mb={4} p={3}>
                  <Text fontSize={'2.5rem'} fontWeight={600} color="gray.dark">
                    {recipe.name}
                  </Text>
                  <Box>
                    <Badge
                      variant={'solid'}
                      colorScheme={getSupermarketBrandColor(
                        recipe.supermarketName,
                      )}
                      fontSize="1em"
                    >
                      {recipe.supermarketName}
                    </Badge>
                  </Box>
                </BorderBox>
                <Tabs
                  borderWidth={'1px'}
                  borderRadius={'lg'}
                  p={3}
                  variant={'enclosed'}
                  size={'lg'}
                  isFitted
                  defaultIndex={0}
                >
                  <TabList>
                    <Tab _selected={{ bg: 'brand.50' }}>Method</Tab>
                    <Tab _selected={{ bg: 'brand.50' }}>Ingredients</Tab>
                    <Tab _selected={{ bg: 'brand.50' }}>
                      Additional information
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Box display={'flex'} flexDirection={'column'} p={3}>
                        <Box mb={2.5}>
                          <Box>
                            <Text
                              fontSize={'1.5rem'}
                              fontWeight={450}
                              color="gray.dark"
                              mt={2}
                            >
                              Method
                            </Text>
                          </Box>
                          <Box>
                            <Text
                              fontSize={'sm'}
                              letterSpacing={'wide'}
                              fontWeight={'semibold'}
                              color={'gray.500'}
                            >
                              for {recipe.baseServings} servings - change as
                              needed
                            </Text>
                          </Box>
                        </Box>

                        <Box>
                          {recipe.instructionsList.map(
                            (instruction: {
                              id: number;
                              instruction: string;
                              step: number;
                            }) => {
                              return (
                                <Box
                                  key={instruction.step}
                                  display="flex"
                                  flexDirection={'row'}
                                  mb={2.5}
                                  alignItems={'center'}
                                >
                                  <Box
                                    mr={'0.5rem'}
                                    borderRadius={'9999px'}
                                    borderWidth={'1px'}
                                    width={'1.75rem'}
                                    height={'1.75rem'}
                                    display="flex"
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    borderColor={'gray.dark'}
                                  >
                                    <Box>{instruction.step}</Box>
                                  </Box>
                                  <Interweave
                                    content={`${instruction.instruction}`}
                                  />
                                </Box>
                              );
                            },
                          )}
                        </Box>
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <Box
                        borderWidth={'1px'}
                        borderRadius={'lg'}
                        p={3}
                        textAlign={'center'}
                      >
                        <Box>
                          <Text
                            fontSize={'1.2rem'}
                            fontWeight={450}
                            color="gray.dark"
                          >
                            {recipe.baseServings} servings
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            fontSize={'sm'}
                            fontWeight={'semibold'}
                            color={'gray.500'}
                            letterSpacing={'wide'}
                          >
                            £{recipe.pricePerServing} per serving
                          </Text>
                        </Box>
                      </Box>
                      <Box p={3}>
                        <Box mb={2.5}>
                          <Text
                            fontSize={'1.5rem'}
                            fontWeight={450}
                            color="gray.dark"
                          >
                            Ingredients
                          </Text>
                        </Box>
                        <Box>
                          {recipe.ingredientsList.map((ingredient: any) => {
                            return (
                              <Box key={ingredient.id} mb={2.5}>
                                <Text>
                                  {Math.ceil(ingredient.unitQuantity)} x{' '}
                                  {ingredient.name}
                                </Text>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <Box p={3}>
                        <Text>Cooking time (20mins)</Text>
                      </Box>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </>
    );
  };

  const showRecipeDesktop = () => {
    return (
      <>
        <Container maxW="1200px">
          <Grid templateColumns="repeat(2, 1fr);" gap={2}>
            <GridItem w="100%" h="100">
              <Box display={'flex'} flexDirection={'column'}>
                <BorderBox mb={4} p={3}>
                  <Text fontSize={'3.5rem'} fontWeight={600} color="gray.dark">
                    {recipe.name}
                  </Text>
                  <Box>
                    <Badge
                      variant={'solid'}
                      colorScheme={getSupermarketBrandColor(
                        recipe.supermarketName,
                      )}
                      fontSize="1em"
                    >
                      {recipe.supermarketName}
                    </Badge>
                  </Box>
                </BorderBox>

                <BorderBox
                  mb={4}
                  display={'flex'}
                  flexDirection={'column'}
                  p={3}
                >
                  <Box mb={2.5}>
                    <Box>
                      <Text
                        fontSize={'1.5rem'}
                        fontWeight={450}
                        color="gray.dark"
                        mt={2}
                      >
                        Method
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        fontSize={'sm'}
                        fontWeight={'semibold'}
                        color={'gray.500'}
                        letterSpacing={'wide'}
                      >
                        for {recipe.baseServings} servings - change as needed
                      </Text>
                    </Box>
                  </Box>

                  <Box>
                    {recipe.instructionsList.map(
                      (instruction: {
                        id: number;
                        instruction: string;
                        step: number;
                      }) => {
                        return (
                          <Box
                            key={instruction.step}
                            display="flex"
                            flexDirection={'row'}
                            mb={2.5}
                            alignItems={'center'}
                          >
                            <Box
                              mr={'0.5rem'}
                              borderRadius={'9999px'}
                              borderWidth={'1px'}
                              width={'1.75rem'}
                              height={'1.75rem'}
                              display="flex"
                              alignItems={'center'}
                              justifyContent={'center'}
                              borderColor={'gray.dark'}
                            >
                              <Box>{instruction.step}</Box>
                            </Box>
                            <Interweave content={instruction.instruction} />
                          </Box>
                        );
                      },
                    )}
                  </Box>
                </BorderBox>
                <BorderBox mb={4} p={3}>
                  <Box>
                    <Text
                      fontSize={'1.5rem'}
                      fontWeight={450}
                      color="gray.dark"
                    >
                      Additional information
                    </Text>
                  </Box>
                  <Box>
                    <Text>Cooking time ({recipe.cookTime} mins)</Text>
                  </Box>
                  <Box>
                    <Text>Prep time ({recipe.prepTime} mins)</Text>
                  </Box>
                </BorderBox>
              </Box>
            </GridItem>
            <GridItem w="100%" h="100">
              <Box
                borderWidth={'1px'}
                borderTopRadius={'lg'}
                borderBottom={'none'}
                p={3}
                textAlign={'center'}
              >
                <Box>
                  <Text fontSize={'1.2rem'} fontWeight={450} color="gray.dark">
                    {recipe.baseServings} servings
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize={'sm'}
                    fontWeight={'semibold'}
                    color={'gray.500'}
                    letterSpacing={'wide'}
                  >
                    £{recipe.pricePerServing} per serving
                  </Text>
                </Box>
              </Box>
              <Box borderWidth={'1px'} borderBottomRadius={'lg'} mb={4} p={3}>
                <Box mb={2.5}>
                  <Text fontSize={'1.5rem'} fontWeight={450} color="gray.dark">
                    Ingredients
                  </Text>
                </Box>
                <Box>
                  {recipe.ingredientsList.map((ingredient: any) => {
                    return (
                      <Box key={ingredient.id} mb={2.5}>
                        <Text>
                          {Math.ceil(ingredient.unitQuantity)} x{' '}
                          {ingredient.name}
                        </Text>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </>
    );
  };

  return (
    <>
      <Layout excludeFooter>
        <Head>
          <title>{updatedSiteTitle}</title>
        </Head>
        <Box>
          <Container maxW="1200px" mb={4}>
            <BorderBox my={2} width={'100%'} height={300} position={'relative'}>
              <Image
                src={`${process.env.NEXT_PUBLIC_CDN}${recipe.imagePath}`}
                alt={recipe.name}
                layout={'fill'}
                objectFit="cover"
                priority
              />
            </BorderBox>
          </Container>
          {!!isLessThan900 ? showRecipeMobile() : showRecipeDesktop()}
        </Box>
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  if (process.env.NEXT_PUBLIC_ENV === 'development') {
    const paths: Array<any> = [];
    return { paths, fallback: 'blocking' };
  } else {
    const res: any = await getRecipes({
      includeIngredientsWithRecipes: false,
      offset: 0,
      limit: 100,
      order: 'any',
      orderBy: 'relevance',
    });

    const paths: Array<any> = res.recipes.map((recipe: any) => {
      return {
        params: { recipeId: recipe.id.toString() },
      };
    });

    return {
      paths,
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps(context: any) {
  const recipeId = context.params.recipeId;

  // getting one specific recipe
  const res: any = await getRecipes({
    includeIngredientsWithRecipes: true,
    offset: 0,
    limit: 1,
    order: 'any',
    orderBy: 'relevance',
    recipeIds: [parseInt(recipeId)],
  });

  const recipe = res.recipes[0];

  return {
    props: {
      recipe: recipe,
      revalidate: process.env.NEXT_PUBLIC_ENV === 'development' ? 0 : 600,
    },
  };
}

export default Recipe;
