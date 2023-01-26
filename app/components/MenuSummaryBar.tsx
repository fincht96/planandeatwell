import { AddIcon, CloseIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Circle,
  Divider,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { roundTo2dp } from '../utils/roundTo2dp';
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

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="inside"
        size={'full'}
      >
        <ModalOverlay />
        <ModalContent bg="gray.lighterGray">
          <ModalBody pb={'2rem'}>
            <Flex direction={'column'} py={'2rem'}>
              <Flex alignItems={'center'} justifyContent={'space-between'}>
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
              <Text
                color={'gray.dark'}
                fontWeight={'600'}
                letterSpacing={'wide'}
                fontSize={'0.9rem'}
              >
                ({servings} servings @ £{roundTo2dp(currentPrice / servings)}{' '}
                /serving)
              </Text>
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

            <Flex justifyContent={'space-between'} pb={'1rem'}>
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
              fontSize="md"
              fontWeight={600}
              padding={'1.5rem 1.5rem'}
              disabled={!recipeList.length}
              width={'100%'}
              onClick={onComplete}
            >
              Create plan
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
