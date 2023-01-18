import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Circle,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import RecipeBasketButton from './menu/RecipeBasketButton';

export default function MenuSummaryBar({
  currentPrice,
  ingredientList,
  recipeList,
  servings,
  onComplete,
  onAddRecipeServings,
  onRemoveRecipeServings,
}: {
  currentPrice: number;
  ingredientList: any;
  recipeList: any;
  servings: any;
  onComplete: any;
  onAddRecipeServings: (recipe, servings) => void;
  onRemoveRecipeServings: (recipe, servings) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          left: '0px',
          bottom: '0px',
          width: '100%',
          zIndex: '3',
        }}
      >
        <Flex
          bg={useColorModeValue('gray.veryLightGray', 'gray.800')}
          color={useColorModeValue('black', 'white')}
          minH="4rem"
          py={{ base: 2 }}
          px={{ base: 4 }}
          justifyContent={{ base: 'center', md: 'flex-end' }}
          display={{ base: 'none', md: 'flex' }}
          alignItems="center"
        >
          <RecipeBasketButton
            currentPrice={currentPrice}
            ingredientList={ingredientList}
            recipeList={recipeList}
            servings={servings}
            onComplete={onComplete}
            onAddRecipeServings={onAddRecipeServings}
            onRemoveRecipeServings={onRemoveRecipeServings}
          />
        </Flex>

        <Flex
          bg={useColorModeValue('gray.veryLightGray', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH="4rem"
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          justifyContent={'center'}
          display={{ base: 'flex', md: 'none' }}
        >
          <Button
            colorScheme="brand"
            fontWeight={600}
            padding={'1.5rem 1.5rem'}
            disabled={!recipeList.length}
            onClick={() => onOpen()}
            width={'100%'}
          >
            <Flex
              justifyContent={'space-between'}
              alignItems={'center'}
              width={'100%'}
            >
              <Text fontSize="0.9rem" color="white" fontWeight="600">
                Recipes ({recipeList.length})
              </Text>
              <Text fontSize="0.9rem" color="white" fontWeight="600">
                {recipeList.length ? 'View basket' : 'Basket empty'}
              </Text>
              <Text fontSize="0.9rem" color="white" fontWeight="600">
                £{currentPrice}
              </Text>
            </Flex>
          </Button>
        </Flex>
      </Box>

      <Drawer
        onClose={onClose}
        isOpen={isOpen}
        size={'full'}
        placement={'bottom'}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader
            fontSize="2xl"
            fontWeight="600"
            color="black"
            pb="0.25rem"
          >
            Your meal plan
          </DrawerHeader>{' '}
          <DrawerBody>
            <Box pb={'0.5rem'}>
              <Divider />
            </Box>

            <Box pb={'0.5rem'}>
              <Text
                fontSize="sm"
                fontWeight="600"
                color="gray.dark"
                pb={'0.25rem'}
              >
                Recipes
              </Text>

              {recipeList.map((recipe: any) => {
                return (
                  <Flex justifyContent={'space-between'} key={recipe.recipe.id}>
                    <Text
                      py="0.25rem"
                      fontSize="0.78rem"
                      fontWeight="600"
                      color="gray.bone"
                    >
                      {recipe.recipe.name}
                    </Text>

                    <Flex alignItems={'center'} gridGap={'0.5rem'}>
                      <Circle
                        _hover={{ background: 'brand.100' }}
                        size="1.1rem"
                        bg="white"
                        border={'solid 1px'}
                        borderColor={'brand.500'}
                        cursor={'pointer'}
                        onClick={() => {
                          onRemoveRecipeServings(
                            recipe.recipe,
                            recipe.recipe.baseServings,
                          );
                        }}
                      >
                        <MinusIcon color={'brand.500'} width={'0.5rem'} />
                      </Circle>
                      <Text
                        py="0.25rem"
                        fontSize="0.78rem"
                        fontWeight="600"
                        color="gray.dark"
                      >
                        {recipe.servings} servings
                      </Text>

                      <Circle
                        _hover={{ background: 'brand.100' }}
                        size="1.1rem"
                        bg="white"
                        border={'solid 1px'}
                        borderColor={'brand.500'}
                        cursor={'pointer'}
                        onClick={() => {
                          onAddRecipeServings(
                            recipe.recipe,
                            recipe.recipe.baseServings,
                          );
                        }}
                      >
                        <AddIcon color={'brand.500'} width={'0.5rem'} />
                      </Circle>
                    </Flex>
                  </Flex>
                );
              })}
            </Box>

            <Box pb={'0.5rem'}>
              <Text
                fontSize="sm"
                fontWeight="600"
                color="gray.dark"
                pb={'0.25rem'}
              >
                Ingredients
              </Text>

              {ingredientList.map((ingredient: any) => {
                return (
                  <Flex justifyContent={'space-between'} key={ingredient.id}>
                    <Text
                      py="0.25rem"
                      fontSize="0.78rem"
                      fontWeight="600"
                      color="gray.bone"
                      maxWidth="18rem"
                    >
                      {ingredient.name} ({ingredient.unitQuantity})
                    </Text>

                    <Text
                      py={'0.25rem'}
                      fontSize="0.78rem"
                      fontWeight="600"
                      color="gray.bone"
                    >
                      £{ingredient.price}
                    </Text>
                  </Flex>
                );
              })}
            </Box>

            <Box pb={'1rem'}>
              <Divider />
            </Box>

            <Flex justifyContent={'space-between'} pb={'1rem'}>
              <Text fontSize="sm" fontWeight="600" color="gray.dark">
                Total
              </Text>

              <Text fontSize="0.78rem" fontWeight="600" color="gray.dark">
                £{currentPrice}
              </Text>
            </Flex>

            <Button
              colorScheme="brand"
              borderRadius="lg"
              fontSize="sm"
              fontWeight={600}
              padding={'1.5rem 1.5rem'}
              disabled={!recipeList.length}
              width={'100%'}
              onClick={onComplete}
            >
              Checkout
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
