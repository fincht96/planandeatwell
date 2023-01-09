import React from 'react';
import {
  Box,
  Text,
  Grid,
  GridItem,
  Badge,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Tabs,
} from '@chakra-ui/react';
import BorderBox from '../BorderBox';
import getSupermarketBrandColor from '../../utils/getSupermarketBrandColor';
import dynamic from 'next/dynamic';
import { RecipeType } from '../../types/recipe.types';
import { InstructionType } from '../../types/instruction.types';
import { getFormattedQuanityAndUnitText } from '../../utils/recipeHelper';

// run import only on client
const Interweave = dynamic<any>(
  () => import('interweave').then((mod) => mod.Interweave),
  {
    ssr: false,
  },
);

// greater than 900px
export const RecipeViewDesktop = (
  recipe: RecipeType,
  {
    pricePerServing,
    currentServings,
    ingredients,
  }: {
    pricePerServing: number;
    currentServings: number;
    ingredients: Array<any>;
  },
) => {
  return (
    <>
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
                  colorScheme={getSupermarketBrandColor(recipe.supermarketName)}
                  fontSize="1em"
                >
                  {recipe.supermarketName}
                </Badge>
              </Box>
            </BorderBox>

            <BorderBox mb={4} display={'flex'} flexDirection={'column'} p={3}>
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
                {recipe.instructionsList.map((instruction: InstructionType) => {
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
                })}
              </Box>
            </BorderBox>
            <BorderBox mb={4} p={3}>
              <Box>
                <Text fontSize={'1.5rem'} fontWeight={450} color="gray.dark">
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
                {currentServings} servings
              </Text>
            </Box>
            <Box>
              <Text
                fontSize={'sm'}
                fontWeight={'semibold'}
                color={'gray.500'}
                letterSpacing={'wide'}
              >
                £{pricePerServing} per serving
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
              {ingredients.map((ingredient: any) => {
                return (
                  <Box
                    key={ingredient.id}
                    mb={2.5}
                    display="flex"
                    flexDirection="row"
                  >
                    <Text>
                      {Math.ceil(ingredient.unitQuantity)} x {ingredient.name}
                    </Text>
                    <Box ml={1}>
                      <Text fontWeight={600}>
                        {getFormattedQuanityAndUnitText(
                          ingredient.preciseQuantity
                            ? ingredient.preciseQuantity
                            : ingredient.baseValue,
                          ingredient.unit,
                        )}
                      </Text>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
};

// less than 900px
export const RecipeViewMobile = (
  recipe: RecipeType,
  {
    pricePerServing,
    currentServings,
    ingredients,
  }: {
    pricePerServing: number;
    currentServings: number;
    ingredients: Array<any>;
  },
) => {
  return (
    <>
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
                  colorScheme={getSupermarketBrandColor(recipe.supermarketName)}
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
              defaultIndex={1}
            >
              <TabList>
                <Tab _selected={{ bg: 'brand.50' }}>Method</Tab>
                <Tab _selected={{ bg: 'brand.50' }}>Ingredients</Tab>
                <Tab _selected={{ bg: 'brand.50' }}>Additional information</Tab>
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
                          for {recipe.baseServings} servings - change as needed
                        </Text>
                      </Box>
                    </Box>

                    <Box>
                      {recipe.instructionsList.map(
                        (instruction: InstructionType) => {
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
                        {currentServings} servings
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        fontSize={'sm'}
                        fontWeight={'semibold'}
                        color={'gray.500'}
                        letterSpacing={'wide'}
                      >
                        £{pricePerServing} per serving
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
                      {ingredients.map((ingredient: any) => {
                        return (
                          <Box
                            key={ingredient.id}
                            mb={2.5}
                            display="flex"
                            flexDirection="row"
                          >
                            <Text>
                              {Math.ceil(ingredient.unitQuantity)} x{' '}
                              {ingredient.name}
                            </Text>
                            <Box ml={1}>
                              <Text fontWeight={600}>
                                {getFormattedQuanityAndUnitText(
                                  ingredient.preciseQuantity
                                    ? ingredient.preciseQuantity
                                    : ingredient.baseValue,
                                  ingredient.unit,
                                )}
                              </Text>
                            </Box>
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
                  <Box p={3}>
                    <Text>Prep time ({recipe.prepTime} mins)</Text>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
};
