import { Box, Text, Link } from '@chakra-ui/react';
import { TimeIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import BorderBox from '../BorderBox';

const Recipe = ({
  id,
  name,
  pricePerServing,
  imagePath,
  servings,
}: {
  id: number;
  name: string;
  pricePerServing: number;
  imagePath: string;
  servings: number;
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

      <Box p={'6'}>
        <Box display="flex" flexDirection={'row'} position={'relative'}>
          <Box>
            <TimeIcon w={4} h={4} />
          </Box>
          <Box
            color={'gray.500'}
            fontWeight={'semibold'}
            letterSpacing={'wide'}
            fontSize={'xs'}
            textTransform={'uppercase'}
            ml={'1.5rem'}
            position={'absolute'}
            bottom={'0'}
          >
            20mins
          </Box>
        </Box>

        <Box mt={'1'} noOfLines={1}>
          <Text fontSize={'1.5rem'} fontWeight={450} color="gray.dark">
            {name}
          </Text>
        </Box>

        <Box mt={'1'}>
          £{pricePerServing.toFixed(2)} per serving
          <Box as="span" color="gray.600" fontSize="sm">
            / serves ({servings})
          </Box>
        </Box>

        <Box display="flex" mt={'1'} alignItems="center" flexDirection={'row'}>
          <Box mr={'0.3rem'}>
            <Link href={`/recipes/${id}`} isExternal>
              <Text>View recipe</Text>
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
