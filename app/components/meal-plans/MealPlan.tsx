import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import BorderBox from '../BorderBox';

const MealPlan = ({
  uuid,
  name,
  recipesCount,
  ingredientsCount,
  totalServings,
  totalPrice,
  supermarketName,
}: {
  uuid: string;
  name: string;
  recipesCount: number;
  ingredientsCount: number;
  totalServings: number;
  totalPrice: number;
  supermarketName: string;
}) => {
  const router = useRouter();

  return (
    <BorderBox
      height={{
        '2xl': '19.5rem',
        base: '20rem',
      }}
      overflow={'hidden'}
      display={'flex'}
      p={'2rem'}
      border="solid"
    >
      <Box position="relative" width="100%">
        <Box mb="1.5rem">
          <Text
            fontSize={'xl'}
            fontWeight={600}
            color="black"
            noOfLines={1}
            letterSpacing={'wide'}
          >
            {name}
          </Text>
          <Text color={'black'} fontWeight={'600'} fontSize={'sm'}>
            Ingredients from {supermarketName}
          </Text>
        </Box>

        <Flex flexDirection="column">
          <Text color={'gray.bone'} fontSize={'sm'} fontWeight="600">
            Total price
            <Text color="black" fontWeight={'600'} fontSize={'3xl'} mb="0.5rem">
              £{totalPrice}
            </Text>
          </Text>
          <Box display="flex" flexDirection="row" justifyContent="flex-start">
            <Text
              color={'gray.bone'}
              fontSize={'sm'}
              fontWeight="600"
              mr={{ base: '1rem', sm: '0.5rem', md: '1rem' }}
            >
              Recipes
              <Text color="black" fontWeight="600">
                {recipesCount}
              </Text>
            </Text>
            <Text
              color={'gray.bone'}
              fontSize={'sm'}
              fontWeight="600"
              mr={{ base: '1rem', sm: '0.5rem', md: '1rem' }}
            >
              Servings
              <Text color="black" fontWeight="600">
                {totalServings}
              </Text>
            </Text>
            <Text
              color={'gray.bone'}
              fontSize={'sm'}
              fontWeight="600"
              mr={{ base: '1rem', sm: '0.5rem', md: '1rem' }}
            >
              Ingredients
              <Text color="black" fontWeight="600">
                {ingredientsCount}
              </Text>
            </Text>
          </Box>
        </Flex>

        <Box
          display="flex"
          alignItems="center"
          flexDirection={'row'}
          position="absolute"
          bottom="0"
        >
          <Button
            bg="brand.500"
            color="white"
            borderRadius="xl"
            _hover={{
              bg: 'brand.100',
              color: 'black',
            }}
            onClick={() => {
              router.push(`/meal-plans/${uuid}`);
            }}
          >
            <Text fontSize="sm" fontWeight="600">
              View meal plan
            </Text>
          </Button>
        </Box>
      </Box>
    </BorderBox>
  );
};

export default MealPlan;
