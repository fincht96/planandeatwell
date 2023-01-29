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
export const RecipeViewDesktop = ({
  recipe,
  onAddRecipeServings,
  onRemoveRecipeServings,
  pricePerServing,
  currentServings,
  ingredients,
}: {
  recipe: RecipeType;
  onAddRecipeServings?: (recipe: any, numServings: number) => void;
  onRemoveRecipeServings?: (recipe: any, numServings: number) => void;
  pricePerServing: number;
  currentServings: number;
  ingredients: Array<any>;
}) => {
  const showDynamicServingFeatures =
    !!onAddRecipeServings && !!onRemoveRecipeServings;

  return (
    <Grid templateColumns="repeat(2, 1fr);" gap={2} p="1.25rem">
      <GridItem w="100%" h="100" pb={'2rem'}>
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
              {recipe.instructionsList
                .sort((a, b) => a.step - b.step)
                .map((instruction: InstructionType) => {
                  return (
                    <Box
                      px="1rem"
                      key={instruction.step}
                      display="flex"
                      flexDirection={'row'}
                      alignItems={'center'}
                      mb="1rem"
                    >
                      <Circle
                        size="27px"
                        border="solid 2px"
                        borderColor={'gray.600'}
                        bg={'gray.50'}
                        color="gray.600"
                        mr="0.5rem"
                      >
                        <Box as="span" fontWeight="600" fontSize="sm">
                          {instruction.step}
                        </Box>
                      </Circle>
                      <Interweave content={instruction.instruction} />
                    </Box>
                  );
                })}
            </Box>
          </Box>
          <Box px="1rem" mt={2} pb={'5rem'}>
            <Box>
              <Text
                fontSize={'1.5rem'}
                fontWeight={600}
                color="gray.dark"
                mt="1rem"
                mb={'1rem'}
              >
                Additional information
              </Text>
            </Box>
            <Flex flexDirection="row" mb={'1rem'} alignItems={'start'}>
              <Text
                fontSize={'1rem'}
                fontWeight="500"
                color={'gray.600'}
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
                fontSize={'1rem'}
                fontWeight="500"
                color={'gray.600'}
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
      <GridItem
        w="100%"
        pb={'2rem'}
        border={'solid 1px'}
        borderColor="gray.light"
        borderRadius={'2xl'}
      >
        <Box
          borderBottom={'solid 1px'}
          borderColor={'gray.light'}
          p="2rem"
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
                onClick={() => onAddRecipeServings(recipe, recipe.baseServings)}
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
        <Box p="1rem" minHeight="310px" overflow={'hidden'}>
          <Box mb={2.5}>
            <Text fontSize={'1.5rem'} fontWeight={600} color="gray.dark" mt={2}>
              Ingredients
            </Text>
          </Box>
          <Box>
            {ingredients.map((ingredient: any) => {
              return (
                <Box
                  key={ingredient.id}
                  mb={'1rem'}
                  display="flex"
                  flexDirection="column"
                >
                  <Text fontSize="1rem" fontWeight="500" color="gray.700">
                    {currentServings > 0
                      ? `${Math.ceil(ingredient.unitQuantity)}x `
                      : ''}
                    {ingredient.name}
                  </Text>
                  <Text fontSize="sm" fontWeight="600" color="gray.dark">
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
  );
};

// less than 900px
export const RecipeViewMobile = ({
  recipe,
  onAddRecipeServings,
  onRemoveRecipeServings,
  pricePerServing,
  currentServings,
  ingredients,
}: {
  recipe: RecipeType;
  onAddRecipeServings?: (recipe: any, numServings: number) => void;
  onRemoveRecipeServings?: (recipe: any, numServings: number) => void;
  pricePerServing: number;
  currentServings: number;
  ingredients: Array<any>;
}) => {
  const showDynamicServingFeatures =
    !!onAddRecipeServings && !!onRemoveRecipeServings;

  return (
    <Grid templateColumns="repeat(1, 1fr);" gap={2} mb={'5rem'}>
      <GridItem w="100%">
        <Box display={'flex'} flexDirection={'column'}>
          <Box px="1rem" mb={2}>
            <Text fontSize={'2rem'} fontWeight={600} color="black">
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
          <Tabs defaultIndex={1} variant="unstyled" isFitted>
            <TabList
              bg={'gray.50'}
              border={'solid 1px'}
              borderColor={'gray.400'}
              borderRadius={'0.9rem'}
              h={'4rem'}
              mx={'1rem'}
            >
              <Tab
                borderRadius={'0.8rem'}
                color={'gray.dark'}
                fontSize={{ base: '0.9rem', sm: '1rem' }}
                fontWeight={500}
                _selected={{ bg: 'gray.dark', color: 'white', fontWeight: 600 }}
              >
                Instructions
              </Tab>
              <Tab
                borderRadius={'0.8rem'}
                color={'gray.dark'}
                fontSize={{ base: '0.9rem', sm: '1rem' }}
                fontWeight={500}
                _selected={{ bg: 'gray.dark', color: 'white', fontWeight: 600 }}
              >
                Ingredients
              </Tab>
              <Tab
                borderRadius={'0.8rem'}
                color={'gray.dark'}
                fontSize={{ base: '0.9rem', sm: '1rem' }}
                fontWeight={500}
                _selected={{ bg: 'gray.dark', color: 'white', fontWeight: 600 }}
              >
                Additional information
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box display={'flex'} flexDirection={'column'}>
                  <Box mb={3}>
                    <Text fontSize={'sm'} fontWeight="600" color={'gray.bone'}>
                      for {recipe.baseServings} servings - change as needed
                    </Text>
                  </Box>
                  <Box>
                    {recipe.instructionsList
                      .sort((a, b) => a.step - b.step)
                      .map((instruction: InstructionType) => {
                        return (
                          <Box
                            key={instruction.step}
                            display="flex"
                            flexDirection={'row'}
                            alignItems={'center'}
                            mb="1rem"
                          >
                            <Circle
                              size="27px"
                              border="solid 2px"
                              borderColor={'gray.600'}
                              bg={'gray.50'}
                              color="gray.600"
                              mr="0.5rem"
                            >
                              <Box as="span" fontWeight="600" fontSize="sm">
                                {instruction.step}
                              </Box>
                            </Circle>
                            <Text bg={'gray.lighterGray'}>
                              <Interweave content={instruction.instruction} />
                            </Text>
                          </Box>
                        );
                      })}
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
                  <Box>
                    <Text
                      fontSize={'1rem'}
                      fontWeight={600}
                      color="gray.dark"
                      my="1rem"
                    >
                      Ingredients
                    </Text>
                  </Box>
                  <Box pb={'2rem'}>
                    {ingredients.map((ingredient: any) => {
                      return (
                        <Box
                          key={ingredient.id}
                          mb={5}
                          display="flex"
                          flexDirection="column"
                        >
                          <Text
                            fontSize="1rem"
                            fontWeight="500"
                            color="gray.700"
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
                <Flex flexDirection="row" mb={'1rem'}>
                  <Text
                    fontSize={'1rem'}
                    fontWeight="500"
                    color={'gray.600'}
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
                    fontSize={'1rem'}
                    fontWeight="500"
                    color={'gray.600'}
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
  );
};
