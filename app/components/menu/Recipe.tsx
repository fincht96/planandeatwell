import { CheckCircleIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { Badge, Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { SlBasketLoaded, SlClock, SlPeople } from 'react-icons/sl';
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
  ingredientsCount,
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
  ingredientsCount: number;
  selected: boolean;
  onClick: (recipeId: number) => void;
}) => {
  return (
    <BorderBox
      maxH={'xl'}
      overflow={'hidden'}
      cursor={'pointer'}
      borderColor="gray.light"
      onClick={() => onClick(id)}
      bg={selected ? 'brand.100' : 'gray.lightGray'}
      position="relative"
      _hover={{ bg: selected ? 'brand.100' : 'gray.searchBoxGray' }}
    >
      <Box h={'12.5rem'} position={'relative'}>
        <Image
          quality={75}
          src={`${process.env.NEXT_PUBLIC_CDN}/${process.env.NODE_ENV}/${imagePath}`}
          layout={'fill'}
          alt={name}
          objectFit={'cover'}
          priority
        />
      </Box>
      <Box p={'4'} mb={{ base: '1.5rem', md: '2rem' }}>
        <Box noOfLines={1}>
          <Text fontSize={'1.3rem'} fontWeight={600} color="black">
            {name}
          </Text>
        </Box>
        <Box mb="0.8rem">
          <Badge
            variant={'solid'}
            colorScheme={getSupermarketBrandColor(supermarketName)}
          >
            {supermarketName}
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
                {prepTime + cookTime} mins total
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
                £{pricePerServing.toFixed(2)} per serving
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
                Serves ({baseServings})
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
                Ingredients ({ingredientsCount})
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
      <Flex
        justifyContent={'flex-end'}
        position="absolute"
        bottom="2.5"
        right="2.5"
      >
        <CheckCircleIcon visibility={selected ? 'visible' : 'hidden'} />
      </Flex>
    </BorderBox>
  );
};

export default Recipe;
