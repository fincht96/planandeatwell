import { CheckCircleIcon, InfoOutlineIcon, TimeIcon } from '@chakra-ui/icons';
import { Badge, Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import getSupermarketBrandColor from '../../utils/getSupermarketBrandColor';
import BorderBox from '../BorderBox';

const Recipe = ({
  id,
  name,
  pricePerServing,
  imagePath,
  baseServings,
  cookTime,
  prepTime,
  supermarketName,
  selected,
  onClick,
}: {
  id: number;
  name: string;
  pricePerServing: number;
  imagePath: string;
  baseServings: number;
  cookTime: number;
  prepTime: number;
  supermarketName: string;
  selected: boolean;
  onClick: (recipeId: number) => void;
}) => {
  return (
    <BorderBox
      maxH={'xl'}
      overflow={'hidden'}
      cursor={'pointer'}
      onClick={() => onClick(id)}
      border={selected && 'solid black 1px'}
    >
      <Box minH={'20rem'} position={'relative'}>
        <Image
          quality={75}
          src={`${process.env.NEXT_PUBLIC_CDN}${imagePath}`}
          layout={'fill'}
          alt={name}
          objectFit={'cover'}
          priority
        />
      </Box>
      <Box
        p={'4'}
        _hover={{ bg: 'brand.50' }}
        // bg={selected ? 'brand.100' : 'white'}
      >
        <Box noOfLines={1}>
          <Text fontSize={'1.8rem'} fontWeight={800} color="gray.dark">
            {name}
          </Text>
        </Box>

        <Box my={0.5}>
          <Badge
            variant={'solid'}
            colorScheme={getSupermarketBrandColor(supermarketName)}
          >
            {supermarketName}
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
            prep {prepTime} min | cook {cookTime} min
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
            £{pricePerServing.toFixed(2)} per serving | serves {baseServings}
          </Box>
        </Box>

        <Flex justifyContent={'flex-end'}>
          <CheckCircleIcon visibility={selected ? 'visible' : 'hidden'} />
        </Flex>
      </Box>
    </BorderBox>
  );
};

export default Recipe;
