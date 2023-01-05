import { Box, Text, Badge, useDisclosure } from '@chakra-ui/react';
import { TimeIcon, InfoOutlineIcon } from '@chakra-ui/icons';
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
      _hover={{ background: 'gray.100' }}
      cursor="pointer"
    >
      <Box position={'relative'}>
        <Image
          src={`${process.env.NEXT_PUBLIC_CDN}${recipe.imagePath}`}
          alt={recipe.name}
          width="100%"
          height="100%"
          layout="responsive"
          priority
        />
      </Box>
      <Box p={'4'}>
        <Box noOfLines={1}>
          <Text fontSize={'1.8rem'} fontWeight={800} color="gray.dark">
            {recipe.name}
          </Text>
        </Box>

        <Box my={0.5}>
          <Badge
            variant={'solid'}
            colorScheme={getSupermarketBrandColor(recipe.supermarketName)}
          >
            {recipe.supermarketName}
          </Badge>
        </Box>

        <Box
          display="flex"
          flexDirection={'row'}
          position={'relative'}
          my={0.5}
        >
          <Box>
            <TimeIcon w={4} h={4} />
          </Box>
          <Box
            color={'gray.500'}
            fontWeight={'semibold'}
            letterSpacing={'wide'}
            fontSize={'sm'}
            ml={'1.5rem'}
            position={'absolute'}
            bottom={'0'}
          >
            prep {recipe.prepTime} min | cook {recipe.cookTime} min
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection={'row'}
          position={'relative'}
          my={0.5}
        >
          <Box>
            <InfoOutlineIcon w={4} h={4} />
          </Box>
          <Box
            color={'gray.500'}
            fontWeight={'semibold'}
            letterSpacing={'wide'}
            fontSize={'sm'}
            ml={'1.5rem'}
            position={'absolute'}
            bottom={'0'}
          >
            £{recipe.pricePerServing.toFixed(2)} per serving | serves{' '}
            {recipe.baseServings}
          </Box>
        </Box>
        <Box>
          <RecipeModal
            onClose={onClose}
            isOpen={isOpen}
            recipe={recipe}
            fullPath={fullPath}
          />
        </Box>
      </Box>
    </BorderBox>
  );
};

export default RecipeCard;
