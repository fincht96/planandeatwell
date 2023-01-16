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
          bg={useColorModeValue('#D9D9D9', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          justifyContent={{ base: 'center', md: 'flex-end' }}
          display={{ base: 'none', md: 'flex' }}
        >
          <Button
            colorScheme="brand"
            fontSize={'1.2rem'}
            fontWeight={600}
            padding={'1.5rem 1.5rem'}
            disabled={!recipeList.length}
            onClick={onComplete}
          >
            Checkout
          </Button>
        </Flex>

        <Flex
          bg={useColorModeValue('#D9D9D9', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          justifyContent={'center'}
          display={{ base: recipeList.length ? 'flex' : 'none', md: 'none' }}
        >
          <Button
            colorScheme="brand"
            fontSize={'1rem'}
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
              <Box
                boxSizing={'border-box'}
                bg={'brand.600'}
                p={'0.2rem'}
                fontWeight={600}
              >
                {servings}
              </Box>
              <Text>View Basket</Text>
              <Text>£{currentPrice}</Text>
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
}
