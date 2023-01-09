import { CloseIcon, CopyIcon, LinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
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
  onAddRecipeServings: (recipe: any, numServings: number) => void;
  onRemoveRecipeServings: (recipe: any, numServings: number) => void;
}) {
  const {
    onClose: onPopoverClose,
    isOpen: isPopoverOpen,
    onOpen: onPopoverOpen,
  } = useDisclosure();

  const [shareRecipeLinkCopied, setShareRecipeLinkCopied] =
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
        size={!!isLessThan900 ? 'full' : ''}
      >
        <ModalOverlay />
        <ModalContent maxW="65rem" height="100%" padding={0}>
          <ModalBody padding={0} borderWidth={'1px'} borderRadius={'lg'}>
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
                  <Popover
                    isOpen={isPopoverOpen}
                    closeOnBlur={false}
                    placement="bottom"
                    onClose={onPopoverClose}
                  >
                    <PopoverTrigger>
                      <Button
                        aria-label="share-recipe-button"
                        background={'white'}
                        onClick={() => {
                          setShareRecipeLinkCopied(false);
                          onPopoverOpen();
                        }}
                      >
                        <LinkIcon />
                        Share
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverHeader>
                        {shareRecipeLinkCopied ? (
                          <Text textAlign={'center'}>Link copied!</Text>
                        ) : (
                          <Text textAlign={'center'}>Share this recipe</Text>
                        )}
                      </PopoverHeader>
                      <PopoverCloseButton />
                      <PopoverBody>
                        <BorderBox
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
                            <CopyIcon />
                          </Box>
                          <Box ml={1}>
                            {shareRecipeLinkCopied ? (
                              <Text background={'gray.100'}>Copy link</Text>
                            ) : (
                              <Text>Copy link</Text>
                            )}
                          </Box>
                        </BorderBox>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Box>
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
                  src={`${process.env.NEXT_PUBLIC_CDN}${recipe.imagePath}`}
                  alt={recipe.name}
                  layout={'fill'}
                  objectFit="cover"
                  priority
                />
              </Box>
            </BorderBox>
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
