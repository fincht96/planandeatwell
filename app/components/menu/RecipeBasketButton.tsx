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
  Icon,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { RiShoppingBasketFill } from 'react-icons/ri';

const RecipeBasketButton = ({
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
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        leftIcon={<Icon as={RiShoppingBasketFill} color={'brand.500'} />}
        border={'solid 1px'}
        borderColor={'gray.200'}
        bg={'white'}
        fontWeight={400}
        color={'gray.600'}
        onClick={() => onOpen()}
        disabled={!recipeList.length}
      >
        <Text as={'span'} fontWeight={600}>
          £{currentPrice}
        </Text>
        &nbsp;({servings} servings)
      </Button>

      <Drawer onClose={onClose} isOpen={isOpen} size={'md'}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader color={'gray.600'}>Your meal plan</DrawerHeader>
          <DrawerBody>
            <Box pb={'1rem'}>
              <Divider />
            </Box>

            <Box pb={'1rem'}>
              <Text fontSize={'1rem'} color="gray.600" fontWeight={600}>
                Recipes
              </Text>

              {recipeList.map((recipe: any) => {
                return (
                  <Flex justifyContent={'space-between'} key={recipe.recipe.id}>
                    <Text py={'0.5rem'} fontSize={'1rem'} color="gray.500">
                      {recipe.recipe.name}
                    </Text>

                    <Flex alignItems={'center'} gridGap={'0.5rem'}>
                      <Circle
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
                      <Text fontSize={'1rem'} color="gray.600">
                        {recipe.servings} servings
                      </Text>

                      <Circle
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

            <Box pb={'1rem'}>
              <Text fontSize={'1rem'} color="gray.600" fontWeight={600}>
                Ingredients
              </Text>

              {ingredientList.map((ingredient: any) => {
                return (
                  <Flex justifyContent={'space-between'} key={ingredient.id}>
                    <Text py={'0.5rem'} color="gray.500">
                      {ingredient.name} ({ingredient.unitQuantity})
                    </Text>

                    <Text py={'0.5rem'} color="gray.500">
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
              <Text fontSize={'1rem'} color="gray.600" fontWeight={600}>
                Total
              </Text>

              <Text fontSize={'1rem'} color="gray.600" fontWeight={600}>
                £{currentPrice}
              </Text>
            </Flex>

            <Button
              colorScheme="brand"
              fontSize={'1.2rem'}
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
};

RecipeBasketButton.displayName = 'RecipeBasketButton';

export default RecipeBasketButton;
