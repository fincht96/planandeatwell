import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader,
  PopoverArrow,
  PopoverBody,
  Button,
  Box,
  Text,
  IconButton,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { CloseIcon, LinkIcon, CopyIcon } from '@chakra-ui/icons';
import BorderBox from '../BorderBox';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { RecipeViewDesktop, RecipeViewMobile } from './RecipeViews';
import { RecipeType } from '../../types/recipe.types';

export default function RecipeModal({
  isOpen,
  onClose,
  recipe,
  fullPath,
}: {
  isOpen: boolean;
  onClose: () => void;
  recipe: RecipeType;
  fullPath: string;
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
        <ModalContent p={'2rem 0'} maxW="65rem" height="100%" padding={0}>
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
                            copy(`${fullPath}/${recipe.id}`);
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
                  pricePerServing: recipe.pricePerServing,
                  currentServings: recipe.baseServings,
                  allIngredients: recipe.ingredientsList,
                })
              : RecipeViewDesktop(recipe, {
                  pricePerServing: recipe.pricePerServing,
                  currentServings: recipe.baseServings,
                  allIngredients: recipe.ingredientsList,
                })}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
