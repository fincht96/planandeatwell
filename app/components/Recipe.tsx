import { Box, Button, Flex, Link, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';

const Recipe = ({
  id,
  name,
  pricePerServing,
  imagePath,
  showRemove,
  onClick,
  link,
}: {
  id: number;
  name: string;
  pricePerServing: number;
  imagePath: string;
  showRemove: Boolean;
  link: string;
  onClick: (id: number) => void;
}) => {
  return (
    <Flex
      flexDirection={'column'}
      alignItems={'stretch'}
      justifyContent={'space-between'}
    >
      <Box flexGrow={1} minH={'25rem'} position={'relative'}>
        <Image
          quality={75}
          src={`${process.env.NEXT_PUBLIC_CDN}${imagePath}`}
          layout={'fill'}
          alt={name}
          objectFit={'cover'}
        />
      </Box>

      <Stack bg={'white'} p={'1rem'} justifyContent={'space-between'}>
        <Stack spacing={'0rem'}>
          <Link href={link} isExternal={true} color="brand.500">
            {name} (4 servings)
          </Link>
        </Stack>

        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <Text color={'#444444'} fontSize={'1rem'}>
            £{pricePerServing.toFixed(2)} per serving
          </Text>

          <Box width={'10rem'} ml={'0.7rem'}>
            {showRemove ? (
              <Button
                bg={'#ffffff'}
                border={'solid 1px'}
                borderColor={'brand.500'}
                color={'brand.500'}
                fontSize={'0.9rem'}
                fontWeight={600}
                width={'100%'}
                onClick={() => onClick(id)}
              >
                - Remove Recipe
              </Button>
            ) : (
              <Button
                colorScheme="brand"
                fontSize={'0.9rem'}
                fontWeight={600}
                width={'100%'}
                onClick={() => onClick(id)}
              >
                + Add Recipe
              </Button>
            )}
          </Box>
        </Flex>
      </Stack>
    </Flex>
  );
};

export default Recipe;
