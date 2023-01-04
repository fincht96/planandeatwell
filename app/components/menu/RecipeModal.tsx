import { AddIcon, CloseIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import getSupermarketBrandColor from '../../utils/getSupermarketBrandColor';
import {
  calcTotalIngredientsPrice,
  roundUpQuantities,
  scaleIngredientQuantities,
} from '../../utils/recipeBasketHelper';
import { roundTo2dp } from '../../utils/roundTo2dp';
import BorderBox from '../BorderBox';

// run import only on client
const Interweave = dynamic<any>(
  () => import('interweave').then((mod) => mod.Interweave),
  {
    ssr: false,
  },
);

export default function RecipeModal({
  isOpen,
  onClose,
  recipe,
  currentServings,
  onAddRecipeServings,
  onRemoveRecipeServings,
}: {
  isOpen: boolean;
  onClose: () => void;
  recipe: any;
  currentServings: number;
  onAddRecipeServings: (recipe: any, numServings: number) => void;
  onRemoveRecipeServings: (recipe: any, numServings: number) => void;
}) {
  const {
    name = '',
    imagePath = '',
    supermarketName = '',
    instructionsList: instructions = [],
    baseServings = '',
    ingredientsList: ingredients = [],
    cookTime,
    prepTime,
  } = recipe;

  const allIngredients =
    currentServings > 0
      ? roundUpQuantities(
          scaleIngredientQuantities(
            recipe.ingredientsList,
            recipe.baseServings,
            currentServings,
          ),
        )
      : ingredients;

  const totalPrice = calcTotalIngredientsPrice(allIngredients);

  const pricePerServing =
    currentServings > 0
      ? roundTo2dp(totalPrice / currentServings)
      : recipe.pricePerServing;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="inside" // on mobile inside and on desktop outside
      >
        <ModalOverlay />
        <ModalContent maxW="65rem" height="100%">
          <ModalBody>
            <BorderBox
              mb={2}
              width={'100%'}
              height={300}
              position={'relative'}
              borderWidth={0}
            >
              <Box
                display="flex"
                flexDirection="row"
                justifyContent={'flex-end'}
                zIndex="1000"
                top="0.5rem"
                position="relative"
              >
                <Box mr={2}>
                  <IconButton
                    background={'white'}
                    icon={<CloseIcon />}
                    onClick={onClose}
                    aria-label="close-modal-button"
                  />
                </Box>
              </Box>
              <Box>
                <Image
                  src={`${process.env.NEXT_PUBLIC_CDN}${imagePath}`}
                  alt={name}
                  layout={'fill'}
                  objectFit="cover"
                  priority
                />
              </Box>
            </BorderBox>
            <Grid templateColumns="repeat(2, 1fr);" gap={2}>
              <GridItem w="100%" h="100">
                <Box display={'flex'} flexDirection={'column'}>
                  <BorderBox mb={4} p={3}>
                    <Text
                      fontSize={'3.5rem'}
                      fontWeight={600}
                      color="gray.dark"
                    >
                      {name}
                    </Text>
                    <Box>
                      <Badge
                        variant={'solid'}
                        colorScheme={getSupermarketBrandColor(supermarketName)}
                        fontSize="1em"
                      >
                        {supermarketName}
                      </Badge>
                    </Box>
                  </BorderBox>
                  ​
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
                          for {baseServings} servings - change as needed
                        </Text>
                      </Box>
                    </Box>
                    ​
                    <Box>
                      {instructions.map(
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
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                      <Text>Cooking time ({cookTime} mins)</Text>
                    </Box>
                    <Box>
                      <Text>Prep time ({prepTime} mins)</Text>
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
                  <Flex justifyContent={'space-between'}>
                    <Button
                      bg={'brand.500'}
                      color={'white'}
                      _hover={{ background: 'brand.600' }}
                      _active={{ background: 'brand.600' }}
                      onClick={() => onRemoveRecipeServings(recipe, 4)}
                    >
                      <MinusIcon />
                    </Button>

                    <Box>
                      <Text
                        fontSize={'1.2rem'}
                        fontWeight={450}
                        color="gray.dark"
                      >
                        {currentServings} servings added
                      </Text>
                    </Box>
                    <Button
                      bg={'brand.500'}
                      color={'white'}
                      _hover={{ background: 'brand.600' }}
                      _active={{ background: 'brand.600' }}
                      onClick={() => onAddRecipeServings(recipe, 4)}
                    >
                      <AddIcon />
                    </Button>
                  </Flex>

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
                    <Text
                      fontSize={'1.5rem'}
                      fontWeight={450}
                      color="gray.dark"
                    >
                      Ingredients
                    </Text>
                  </Box>
                  <Box>
                    {allIngredients.map((ingredient: any) => {
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
