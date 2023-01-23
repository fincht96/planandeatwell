import { Box, Text, Badge, useDisclosure, Flex } from '@chakra-ui/react';
import { TimeIcon, InfoOutlineIcon } from '@chakra-ui/icons';
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
      maxW={'sm'}
      maxH={'xl'}
      overflow={'hidden'}
      onClick={onOpen}
      _hover={{ background: 'brand.100' }}
      cursor="pointer"
      // borderColor="gray.light"
      border="none"
      bg="gray.lighterGray"
      margin="auto"
    >
      <RecipeModal
        onClose={onClose}
        isOpen={isOpen}
        recipe={recipe}
        fullPath={fullPath}
      />
      <Box position={'relative'}>
        <Image
          src={`${process.env.NEXT_PUBLIC_CDN}${recipe.imagePath}`}
          alt={recipe.name}
          width="100%"
          height="70%"
          layout="responsive"
          priority
        />
      </Box>
      <Box
        p={'4'}
        borderBottomLeftRadius="lg"
        borderBottomRightRadius="lg"
        borderWidth="1px"
        borderTop="none"
        bg="white"
        borderColor="#dad1d1"
        // borderColor="gray.light"
      >
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
