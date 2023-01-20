import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Circle,
  Flex,
  Grid,
  GridItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { InstructionType } from '../../types/instruction.types';
import { RecipeType } from '../../types/recipe.types';
import getSupermarketBrandColor from '../../utils/getSupermarketBrandColor';
import {
  getFormattedQuantityAndUnitText,
  toTwoSignificantFigures,
} from '../../utils/recipeBasketHelper';

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
    onAddRecipeServings,
    onRemoveRecipeServings,
    pricePerServing,
    currentServings,
    ingredients,
  }: {
    onAddRecipeServings?: (recipe: any, numServings: number) => void;
    onRemoveRecipeServings?: (recipe: any, numServings: number) => void;
    pricePerServing: number;
    currentServings: number;
    ingredients: Array<any>;
  },
) => {
  const showDynamicServingFeatures =
    !!onAddRecipeServings && !!onRemoveRecipeServings;

  return (
    <>
      <Grid templateColumns="repeat(2, 1fr);" gap={2} p="1.25rem">
        <GridItem w="100%" h="100">
          <Box display={'flex'} flexDirection={'column'}>
            <Box px="1rem">
              <Text fontSize={'3rem'} fontWeight={600} color="black">
                {recipe.name}
              </Text>
              <Box>
                <Badge
                  variant={'solid'}
                  colorScheme={getSupermarketBrandColor(recipe.supermarketName)}
                  fontSize="1rem"
                >
                  {recipe.supermarketName}
                </Badge>
              </Box>
            </Box>
            <Box display={'flex'} flexDirection={'column'}>
              <Box px="1rem" my="1rem">
                <Box>
                  <Text
                    fontSize={'1.5rem'}
                    fontWeight={600}
                    color="gray.dark"
                    mt={2}
                  >
                    Instructions
                  </Text>
                </Box>
                <Box>
                  <Text fontSize={'sm'} fontWeight="600" color={'gray.bone'}>
                    for {recipe.baseServings} servings - change as needed
                  </Text>
                </Box>
              </Box>
              <Box>
                {recipe.instructionsList.map((instruction: InstructionType) => {
                  return (
                    <Box
                      px="1rem"
                      key={instruction.step}
                      display="flex"
                      flexDirection={'row'}
                      alignItems={'center'}
                      mb="0.5rem"
                    >
                      <Circle
                        size="27px"
                        bg="brand.500"
                        color="white"
                        mr="0.5rem"
                      >
                        <Box as="span" fontWeight="600" fontSize="sm">
                          {instruction.step}
                        </Box>
                      </Circle>
                      <Text
                        color="black"
                        fontSize="sm"
                        fontWeight="300"
                        letterSpacing={'wide'}
                      >
                        <Interweave content={instruction.instruction} />
                      </Text>
                    </Box>
                  );
                })}
              </Box>
            </Box>
            <Box px="1rem" mt={2}>
              <Box>
                <Text
                  fontSize={'1.5rem'}
                  fontWeight={600}
                  color="gray.dark"
                  mt="1rem"
                >
                  Additional information
                </Text>
              </Box>
              <Flex flexDirection="row">
                <Text
                  fontSize={'sm'}
                  fontWeight="600"
                  color={'gray.bone'}
                  mr={1}
                >
                  Cooking time
                </Text>
                <Text fontSize={'sm'} fontWeight="600" color={'gray.dark'}>
                  ({recipe.cookTime} mins)
                </Text>
              </Flex>
              <Flex flexDirection="row">
                <Text
                  fontSize={'sm'}
                  fontWeight="600"
                  color={'gray.bone'}
                  mr={1}
                >
                  Prep time
                </Text>
                <Text fontSize={'sm'} fontWeight="600" color={'gray.dark'}>
                  ({recipe.prepTime} mins)
                </Text>
              </Flex>
            </Box>
          </Box>
        </GridItem>
        <GridItem w="100%" h="100">
          <Box
            borderColor="gray.light"
            borderWidth={'1px'}
            borderTopRadius={'xl'}
            borderBottom={'none'}
            p="1rem"
            textAlign={'center'}
          >
            <Flex
              justifyContent={
                showDynamicServingFeatures ? 'space-between' : 'center'
              }
            >
              {showDynamicServingFeatures && (
                <Button
                  borderRadius="lg"
                  bg={'brand.500'}
                  color={'white'}
                  _hover={{ background: 'brand.400' }}
                  _active={{ background: 'brand.400' }}
                  onClick={() =>
                    onRemoveRecipeServings(recipe, recipe.baseServings)
                  }
                >
                  <MinusIcon fontSize="1rem" />
                </Button>
              )}
              <Box>
                <Text fontSize={'1.2rem'} fontWeight={600} color="gray.dark">
                  {currentServings} servings{' '}
                  {showDynamicServingFeatures && 'added'}
                </Text>
              </Box>
              {showDynamicServingFeatures && (
                <Button
                  borderRadius="lg"
                  bg={'brand.500'}
                  color={'white'}
                  _hover={{ background: 'brand.400' }}
                  _active={{ background: 'brand.400' }}
                  onClick={() =>
                    onAddRecipeServings(recipe, recipe.baseServings)
                  }
                >
                  <AddIcon fontSize="1rem" />
                </Button>
              )}
            </Flex>
            <Box>
              <Text fontSize={'sm'} fontWeight={'300'} color={'gray.dark'}>
                £{pricePerServing} per serving
              </Text>
            </Box>
          </Box>
          <Box
            borderWidth={'1px'}
            borderBottomRadius={'xl'}
            p="1rem"
            borderColor="gray.light"
            minHeight="310px"
          >
            <Box mb={2.5}>
              <Text
                fontSize={'1.5rem'}
                fontWeight={600}
                color="gray.dark"
                mt={2}
              >
                Ingredients
              </Text>
            </Box>
            <Box>
              {ingredients.map((ingredient: any) => {
                return (
                  <Box
                    key={ingredient.id}
                    mb={1}
                    display="flex"
                    flexDirection="row"
                    justifyContent={{
                      base: 'space-between',
                      lg: 'start',
                    }}
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      color="gray.bone"
                      maxWidth={{
                        base: currentServings > 0 ? '260px' : 'none',
                        lg: 'none',
                      }}
                    >
                      {currentServings > 0
                        ? `${Math.ceil(ingredient.unitQuantity)}x `
                        : ''}
                      {ingredient.name}
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      color="gray.dark"
                      ml="0.4rem"
                    >
                      {currentServings > 0
                        ? getFormattedQuantityAndUnitText(
                            toTwoSignificantFigures(ingredient.scalarQuantity),
                            ingredient.unit,
                          )
                        : ''}
                    </Text>
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
    onAddRecipeServings,
    onRemoveRecipeServings,
    pricePerServing,
    currentServings,
    ingredients,
  }: {
    onAddRecipeServings?: (recipe: any, numServings: number) => void;
    onRemoveRecipeServings?: (recipe: any, numServings: number) => void;
    pricePerServing: number;
    currentServings: number;
    ingredients: Array<any>;
  },
) => {
  const showDynamicServingFeatures =
    !!onAddRecipeServings && !!onRemoveRecipeServings;

  return (
    <>
      <Grid templateColumns="repeat(1, 1fr);" gap={2}>
        <GridItem w="100%" h="100">
          <Box display={'flex'} flexDirection={'column'}>
            <Box px="1rem" mb={2}>
              <Text fontSize={'3rem'} fontWeight={600} color="black">
                {recipe.name}
              </Text>
              <Box>
                <Badge
                  variant={'solid'}
                  colorScheme={getSupermarketBrandColor(recipe.supermarketName)}
                  fontSize="1rem"
                >
                  {recipe.supermarketName}
                </Badge>
              </Box>
            </Box>
            <Tabs
              p={3}
              variant={'enclosed'}
              size="sm"
              isFitted
              defaultIndex={1}
            >
              <TabList>
                <Tab
                  height="3.5rem"
                  _selected={{ bg: 'black', color: 'white' }}
                >
                  <Text fontSize={'1rem'} fontWeight={600}>
                    Instructions
                  </Text>
                </Tab>
                <Tab
                  height="3.5rem"
                  _selected={{ bg: 'black', color: 'white' }}
                >
                  <Text fontSize={'1rem'} fontWeight={600}>
                    Ingredients
                  </Text>
                </Tab>
                <Tab
                  height="3.5rem"
                  _selected={{ bg: 'black', color: 'white' }}
                >
                  <Text fontSize={'1rem'} fontWeight={600}>
                    Additional information
                  </Text>
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box display={'flex'} flexDirection={'column'}>
                    <Box mb={3}>
                      <Text
                        fontSize={'sm'}
                        fontWeight="600"
                        color={'gray.bone'}
                      >
                        for {recipe.baseServings} servings - change as needed
                      </Text>
                    </Box>
                    <Box>
                      {recipe.instructionsList.map(
                        (instruction: InstructionType) => {
                          return (
                            <Box
                              key={instruction.step}
                              display="flex"
                              flexDirection={'row'}
                              alignItems={'center'}
                              mb="0.5rem"
                            >
                              <Circle
                                size="27px"
                                bg="brand.500"
                                color="white"
                                mr="0.5rem"
                              >
                                <Box as="span" fontWeight="600" fontSize="sm">
                                  {instruction.step}
                                </Box>
                              </Circle>
                              <Text
                                color="black"
                                fontSize="sm"
                                fontWeight="300"
                                letterSpacing={'wide'}
                              >
                                <Interweave content={instruction.instruction} />
                              </Text>
                            </Box>
                          );
                        },
                      )}
                    </Box>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box
                    borderColor="gray.light"
                    borderWidth={'1px'}
                    borderRadius={'xl'}
                    p="1rem"
                    textAlign={'center'}
                  >
                    <Flex
                      justifyContent={
                        showDynamicServingFeatures ? 'space-between' : 'center'
                      }
                    >
                      {showDynamicServingFeatures && (
                        <Button
                          borderRadius="lg"
                          bg={'brand.500'}
                          color={'white'}
                          _hover={{ background: 'brand.400' }}
                          _active={{ background: 'brand.400' }}
                          onClick={() =>
                            onRemoveRecipeServings(recipe, recipe.baseServings)
                          }
                        >
                          <MinusIcon fontSize="1rem" />
                        </Button>
                      )}
                      <Box>
                        <Text
                          fontSize={'1.2rem'}
                          fontWeight={600}
                          color="gray.dark"
                        >
                          {currentServings} servings{' '}
                          {showDynamicServingFeatures && 'added'}
                        </Text>
                      </Box>
                      {showDynamicServingFeatures && (
                        <Button
                          borderRadius="lg"
                          bg={'brand.500'}
                          color={'white'}
                          _hover={{ background: 'brand.400' }}
                          _active={{ background: 'brand.400' }}
                          onClick={() =>
                            onAddRecipeServings(recipe, recipe.baseServings)
                          }
                        >
                          <AddIcon fontSize="1rem" />
                        </Button>
                      )}
                    </Flex>
                    <Box>
                      <Text
                        fontSize={'sm'}
                        fontWeight={'300'}
                        color={'gray.dark'}
                      >
                        £{pricePerServing} per serving
                      </Text>
                    </Box>
                  </Box>
                  <Box>
                    <Box mb={2.5}>
                      <Text
                        fontSize={'1rem'}
                        fontWeight={600}
                        color="gray.dark"
                        mt="1rem"
                      >
                        Ingredients
                      </Text>
                    </Box>
                    <Box>
                      {ingredients.map((ingredient: any) => {
                        return (
                          <Box
                            key={ingredient.id}
                            mb={1.5}
                            display="flex"
                            flexDirection="row"
                            justifyContent={{
                              base: 'space-between',
                              sm: 'start',
                            }}
                          >
                            <Text
                              fontSize="sm"
                              fontWeight="600"
                              color="gray.bone"
                              maxWidth={{
                                base: currentServings > 0 ? '250px' : 'none',
                                sm: 'none',
                              }}
                            >
                              {currentServings > 0
                                ? `${Math.ceil(ingredient.unitQuantity)}x `
                                : ''}
                              {ingredient.name}
                            </Text>
                            <Text
                              fontSize="sm"
                              fontWeight="600"
                              color="gray.dark"
                              ml="0.2rem"
                            >
                              {currentServings > 0
                                ? getFormattedQuantityAndUnitText(
                                    toTwoSignificantFigures(
                                      ingredient.scalarQuantity,
                                    ),
                                    ingredient.unit,
                                  )
                                : ''}
                            </Text>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Flex flexDirection="row">
                    <Text
                      fontSize={'sm'}
                      fontWeight="600"
                      color={'gray.bone'}
                      mr={1}
                    >
                      Cooking time
                    </Text>
                    <Text fontSize={'sm'} fontWeight="600" color={'gray.dark'}>
                      ({recipe.cookTime} mins)
                    </Text>
                  </Flex>
                  <Flex flexDirection="row">
                    <Text
                      fontSize={'sm'}
                      fontWeight="600"
                      color={'gray.bone'}
                      mr={1}
                    >
                      Prep time
                    </Text>
                    <Text fontSize={'sm'} fontWeight="600" color={'gray.dark'}>
                      ({recipe.prepTime} mins)
                    </Text>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </GridItem>
      </Grid>
    </>
  );
};
