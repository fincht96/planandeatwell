import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Flex, Text } from '@chakra-ui/react';
import BorderBox from '../BorderBox';
import ChakraNextLink from '../NextChakraLink';

const MealPlan = ({
  uuid,
  name,
  recipesCount,
  ingredientsCount,
  totalServings,
  totalPrice,
}: {
  uuid: string;
  name: string;
  recipesCount: number;
  ingredientsCount: number;
  totalServings: number;
  totalPrice: number;
}) => {
  return (
    <BorderBox
      height={'10rem'}
      overflow={'hidden'}
      display={'flex'}
      px={'2rem'}
    >
      <Box my={'auto'}>
        <Box my={'1'} noOfLines={1}>
          <Text fontSize={'1.2rem'} fontWeight={450} color="gray.dark">
            {name}
          </Text>
        </Box>

        <Flex>
          <Text
            color={'gray.500'}
            fontWeight={'semibold'}
            letterSpacing={'wide'}
            fontSize={'sm'}
          >
            {recipesCount} recipes | {ingredientsCount} ingredients <br />
            {totalServings} servings | total price £{totalPrice}
          </Text>
        </Flex>

        <Box display="flex" mt={'1'} alignItems="center" flexDirection={'row'}>
          <Box mr={'0.3rem'}>
            <ChakraNextLink href={`/meal-plans/${uuid}`} color={'brand.500'}>
              <Text>View meal plan</Text>
            </ChakraNextLink>
          </Box>
          <Box>
            <ArrowForwardIcon w={4} h={4} color={'brand.500'} />
          </Box>
        </Box>
      </Box>
    </BorderBox>
  );
};

export default MealPlan;
