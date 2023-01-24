import { CloseIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import copy from 'copy-to-clipboard';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  SlCheck,
  SlShare,
  SlSizeActual,
  SlSizeFullscreen,
} from 'react-icons/sl';
import { RecipeType } from '../../types/recipe.types';
import {
  addScalarQuantity,
  calcTotalIngredientsPrice,
  scaleIngredientQuantities,
} from '../../utils/recipeBasketHelper';
import { roundTo2dp } from '../../utils/roundTo2dp';
import BorderBox from '../BorderBox';
import { RecipeViewDesktop, RecipeViewMobile } from '../shared/RecipeViews';

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
  recipe: RecipeType;
  currentServings: number;
  onAddRecipeServings?: (recipe: any, numServings: number) => void;
  onRemoveRecipeServings?: (recipe: any, numServings: number) => void;
}) {
  const {
    onClose: onPopoverClose,
    isOpen: isPopoverOpen,
    onOpen: onPopoverOpen,
  } = useDisclosure();

  const [shareRecipeLinkCopied, setShareRecipeLinkCopied] =
    useState<boolean>(false);

  const [showFullModalScreen, setShowFullModalScreen] =
    useState<boolean>(false);

  const [isLessThan900] = useMediaQuery('(max-width: 900px)');

  useEffect(() => {
    // if modal is closed
    if (!isOpen) {
      setShareRecipeLinkCopied(false);
      onPopoverClose();
    }
  }, [isOpen, onPopoverClose]);

  const decoratedIngredients =
    currentServings > 0
      ? addScalarQuantity(
          scaleIngredientQuantities(
            recipe.ingredientsList,
            recipe.baseServings,
            currentServings,
          ),
        )
      : recipe.ingredientsList;

  const totalPrice = calcTotalIngredientsPrice(decoratedIngredients);

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
        scrollBehavior="inside"
        size={showFullModalScreen || isLessThan900 ? 'full' : ''}
      >
        <ModalOverlay />
        <ModalContent
          maxW={showFullModalScreen ? 'none' : '65rem'}
          width="100%"
          height="100%"
          bg="gray.lighterGray"
          marginTop={{
            base: 'none',
            xl: showFullModalScreen ? 'none' : '4.5rem',
          }}
          borderRadius="none"
        >
          <ModalBody padding={0}>
            <Box
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
                  {!isLessThan900 && (
                    <Button
                      borderRadius="lg"
                      color="black"
                      fontSize="sm"
                      leftIcon={
                        showFullModalScreen ? (
                          <SlSizeActual fontSize="1rem" />
                        ) : (
                          <SlSizeFullscreen fontSize="1rem" />
                        )
                      }
                      aria-label="share-recipe-button"
                      background="gray.lighterGray"
                      onClick={() => {
                        setShowFullModalScreen(!showFullModalScreen);
                      }}
                    >
                      {showFullModalScreen ? 'Small screen' : 'Full screen'}
                    </Button>
                  )}
                  <Popover
                    isOpen={isPopoverOpen}
                    closeOnBlur={false}
                    placement="bottom-end"
                    onClose={onPopoverClose}
                  >
                    <PopoverTrigger>
                      <Button
                        ml={2}
                        borderRadius="lg"
                        color="black"
                        fontSize="sm"
                        leftIcon={<SlShare fontSize="1rem" />}
                        aria-label="share-recipe-button"
                        background="gray.lighterGray"
                        onClick={() => {
                          setShareRecipeLinkCopied(false);
                          onPopoverOpen();
                        }}
                      >
                        Share
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      bg="gray.lighterGray"
                      width="280px"
                      borderRadius="xl"
                      p={1}
                    >
                      <PopoverArrow />
                      <PopoverHeader border="none" pb={0}>
                        {shareRecipeLinkCopied ? (
                          <Flex justifyContent="center" alignItems="center">
                            <SlCheck fontSize="0.9rem" />
                            <Text
                              ml={1}
                              textAlign={'center'}
                              fontSize="sm"
                              fontWeight="600"
                              color="black"
                            >
                              Link copied!
                            </Text>
                          </Flex>
                        ) : (
                          <Text
                            textAlign={'center'}
                            fontSize="sm"
                            fontWeight="600"
                            color="black"
                          >
                            Share recipe
                          </Text>
                        )}
                      </PopoverHeader>
                      <PopoverCloseButton />
                      <PopoverBody>
                        <BorderBox
                          borderRadius="lg"
                          _hover={{
                            bg: 'brand.400',
                            borderColor: 'brand.400',
                          }}
                          bg="brand.500"
                          borderColor="brand.500"
                          height="2.5rem"
                          cursor={'pointer'}
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="center"
                          onClick={() => {
                            copy(
                              `${process.env.NEXT_PUBLIC_WWW_URL}/recipes/${recipe.id}`,
                            );
                            setShareRecipeLinkCopied(true);
                          }}
                        >
                          <Box>
                            <CopyIcon color="white" fontSize="1.1rem" />
                          </Box>
                          <Box
                            ml={1}
                            bg={shareRecipeLinkCopied ? 'brand.200' : 'none'}
                          >
                            <Text
                              fontSize="sm"
                              fontWeight="600"
                              color="white"
                              width="200px"
                              noOfLines={1}
                            >
                              {process.env.NEXT_PUBLIC_WWW_URL}/recipes/
                              {recipe.id}
                            </Text>
                          </Box>
                        </BorderBox>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Box>
                <Box mr={2}>
                  <IconButton
                    borderRadius="lg"
                    fontSize="0.7rem"
                    background={'white'}
                    icon={<CloseIcon />}
                    onClick={onClose}
                    aria-label="close-modal-button"
                  />
                </Box>
              </Box>
              <Box>
                <Image
                  src={`${process.env.NEXT_PUBLIC_CDN}/${process.env.NODE_ENV}/${recipe.imagePath}`}
                  alt={recipe.name}
                  layout={'fill'}
                  objectFit="cover"
                  priority
                />
              </Box>
            </Box>
            {!!isLessThan900
              ? RecipeViewMobile(recipe, {
                  onAddRecipeServings,
                  onRemoveRecipeServings,
                  pricePerServing,
                  currentServings,
                  ingredients: decoratedIngredients,
                })
              : RecipeViewDesktop(recipe, {
                  onAddRecipeServings,
                  onRemoveRecipeServings,
                  pricePerServing,
                  currentServings,
                  ingredients: decoratedIngredients,
                })}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
