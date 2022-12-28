import { Box, Text, Link } from '@chakra-ui/react';
import { TimeIcon, ArrowForwardIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import BorderBox from '../BorderBox';

const Recipe = ({
  id,
  name,
  pricePerServing,
  imagePath,
  servings,
  cookTime,
  prepTime,
}: {
  id: number;
  name: string;
  pricePerServing: number;
  imagePath: string;
  servings: number;
  cookTime: number;
  prepTime: number;
}) => {
  return (
    <BorderBox maxW={'sm'} maxH={'xl'} overflow={'hidden'}>
      <Box>
        <Link href={`/recipes/${id}`} isExternal>
          <Image
            src={`${process.env.NEXT_PUBLIC_CDN}${imagePath}`}
            alt={name}
            width="100%"
            height="100%"
            layout="responsive"
            priority
          />
        </Link>
      </Box>
      <Box p={'4'}>
        <Box noOfLines={1}>
          <Text fontSize={'1.8rem'} fontWeight={800} color="gray.dark">
            {name}
          </Text>
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
            £{pricePerServing.toFixed(2)} per serving | serves {servings}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" flexDirection={'row'} mt={4}>
          <Box mr={'0.3rem'}>
            <Link href={`/recipes/${id}`} isExternal>
              <Text fontSize={'md'} letterSpacing={'wide'}>
                view recipe
              </Text>
            </Link>
          </Box>
          <Box>
            <ArrowForwardIcon w={4} h={4} />
          </Box>
        </Box>
      </Box>
    </BorderBox>
  );
};

export default Recipe;
