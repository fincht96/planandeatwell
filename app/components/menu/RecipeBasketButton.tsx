import { AddIcon, CloseIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Circle,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  Flex,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

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
        borderRadius="lg"
        colorScheme="brand"
        fontWeight={600}
        p="1.25rem"
        disabled={!recipeList.length}
        onClick={() => onOpen()}
        width={{
          base: '36%',
          lg: '30%',
          xl: '26%',
          '1xl': '24%',
          '2xl': '22%',
          '3xl': '20%',
        }}
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

      <Drawer onClose={onClose} isOpen={isOpen} size={'md'}>
        <DrawerContent bg="gray.lighterGray">
          <DrawerBody>
            <Flex
              alignItems={'center'}
              justifyContent={'space-between'}
              py={'2rem'}
            >
              <Text fontSize="2xl" fontWeight="600" color="black">
                Your meal plan
              </Text>

              <IconButton
                borderRadius="lg"
                fontSize="0.7rem"
                bg="gray.lighterGray"
                icon={<CloseIcon />}
                onClick={onClose}
                aria-label="close-modal-button"
              />
            </Flex>

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
                  <Flex
                    justifyContent={'space-between'}
                    key={recipe.recipe.id}
                    mb={'1rem'}
                  >
                    <Text fontSize="1rem" fontWeight="500" color="gray.700">
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
                        color={'gray.dark'}
                        fontWeight={'600'}
                        letterSpacing={'wide'}
                        fontSize={{ base: '0.8rem', lg: '0.9rem' }}
                        ml={'0.5rem'}
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
                  <Flex
                    justifyContent={'space-between'}
                    key={ingredient.id}
                    mb={'1rem'}
                  >
                    <Text fontSize="1rem" fontWeight="500" color="gray.700">
                      {ingredient.unitQuantity}x {ingredient.name}
                    </Text>

                    <Text
                      color={'gray.dark'}
                      fontWeight={'600'}
                      letterSpacing={'wide'}
                      fontSize={{ base: '0.8rem', lg: '0.9rem' }}
                      ml={'0.5rem'}
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

            <Flex justifyContent={'space-between'} pb={'2rem'}>
              <Text
                color={'gray.dark'}
                fontWeight={'600'}
                letterSpacing={'wide'}
                fontSize={'1rem'}
              >
                Total
              </Text>

              <Text
                color={'gray.dark'}
                fontWeight={'600'}
                letterSpacing={'wide'}
                fontSize={'1rem'}
              >
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
              Create plan
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

RecipeBasketButton.displayName = 'RecipeBasketButton';

export default RecipeBasketButton;
