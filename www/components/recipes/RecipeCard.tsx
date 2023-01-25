import { Box, Text, Badge, useDisclosure, Flex } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { SlBasketLoaded, SlClock, SlPeople } from 'react-icons/sl';
import Image from 'next/image';
import BorderBox from '../BorderBox';
import getSupermarketBrandColor from '../../utils/getSupermarketBrandColor';
import RecipeModal from './RecipeModal';
import { RecipeType } from '../../types/recipe.types';

const RecipeCard = ({
  recipe,
  fullPath,
}: {
  recipe: RecipeType;
  fullPath: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <BorderBox
      maxH={'xl'}
      overflow={'hidden'}
      cursor={'pointer'}
      borderColor="gray.light"
      onClick={onOpen}
      bg="gray.lighterGray"
      position="relative"
      _hover="brand.100"
    >
      <RecipeModal
        onClose={onClose}
        isOpen={isOpen}
        recipe={recipe}
        fullPath={fullPath}
      />
      <Box h={'12.5rem'} position={'relative'}>
        <Image
          quality={75}
          src={`${process.env.NEXT_PUBLIC_CDN}/${process.env.NODE_ENV}/${recipe.imagePath}`}
          layout={'fill'}
          alt={recipe.name}
          objectFit={'cover'}
          priority
        />
      </Box>
      <Box p={'4'} mb={{ base: '1.5rem', md: '2rem' }}>
        <Box noOfLines={1}>
          <Text fontSize={'1.3rem'} fontWeight={600} color="black">
            {recipe.name}
          </Text>
        </Box>
        <Box mb="0.8rem">
          <Badge
            variant={'solid'}
            colorScheme={getSupermarketBrandColor(recipe.supermarketName)}
          >
            {recipe.supermarketName}
          </Badge>
        </Box>

        <Flex flexDirection="row" justifyContent="flex-start">
          <Flex
            my={0.5}
            flexDirection="column"
            justifyContent="flex-start"
            mr="1.5rem"
          >
            <Flex alignItems="center" mb="0.8rem">
              <SlClock fontSize="1rem" />
              <Text
                color={'gray.dark'}
                fontWeight={'600'}
                letterSpacing={'wide'}
                fontSize="0.8rem"
                ml={'0.5rem'}
              >
                {recipe.prepTime + recipe.cookTime} mins total
              </Text>
            </Flex>
            <Flex alignItems="center">
              <InfoOutlineIcon w={4} h={4} />
              <Text
                color={'gray.dark'}
                fontWeight={'600'}
                letterSpacing={'wide'}
                fontSize="0.8rem"
                ml={'0.5rem'}
              >
                £{recipe.pricePerServing.toFixed(2)} per serving
              </Text>
            </Flex>
          </Flex>
          <Flex flexDirection="column" justifyContent="flex-start">
            <Flex alignItems="center" mb="0.8rem">
              <SlPeople fontSize="1rem" />
              <Text
                color={'gray.dark'}
                fontWeight={'600'}
                letterSpacing={'wide'}
                fontSize="0.8rem"
                ml={'0.5rem'}
              >
                Serves ({recipe.baseServings})
              </Text>
            </Flex>
            <Flex alignItems="center">
              <SlBasketLoaded fontSize="1rem" />
              <Text
                color={'gray.dark'}
                fontWeight={'600'}
                letterSpacing={'wide'}
                fontSize="0.8rem"
                ml={'0.5rem'}
              >
                Ingredients ({recipe.ingredientsCount})
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </BorderBox>
  );
};

export default RecipeCard;
