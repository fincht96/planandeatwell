import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Badge, Box, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { roundTo2dp } from '../../utils/roundTo2dp';
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
      overflow={'hidden'}
      display={'flex'}
      p={'1.5rem'}
      borderColor="gray.light"
      cursor={'pointer'}
      bg={'gray.lightGray'}
      _hover={{ bg: 'gray.searchBoxGray' }}
      onClick={() => {
        router.push(`/meal-plans/${uuid}`);
      }}
    >
      <Box width={'100%'}>
        <Box mb="2rem">
          <Text
            fontSize={'xl'}
            fontWeight={600}
            color="black"
            noOfLines={1}
            letterSpacing={'wide'}
          >
            {name}
          </Text>

          <Text
            color={'gray.dark'}
            fontWeight={'600'}
            letterSpacing={'wide'}
            fontSize={'0.9rem'}
          >
            ({totalServings} servings @ £
            {roundTo2dp(totalPrice / totalServings)}
            /serving)
          </Text>

          <Badge variant={'solid'} colorScheme="orange">
            {supermarketName}
          </Badge>
        </Box>

        <Flex flexDirection="column" mb={'1rem'}>
          <Flex justifyContent={'space-between'}>
            <Flex direction={'column'} mb={'1rem'}>
              <Text color={'gray.bone'} fontSize={'sm'} fontWeight="500">
                Total price
              </Text>
              <Text color="black" fontWeight={'600'} fontSize={'1.5rem'}>
                £{totalPrice}
              </Text>
            </Flex>
            <Flex direction={'column'}>
              <Text color={'gray.bone'} fontSize={'sm'} fontWeight="500">
                Recipes
              </Text>
              <Text color="black" fontWeight="600" fontSize={'1.5rem'}>
                {recipesCount}
              </Text>
            </Flex>

            <Flex direction={'column'}>
              <Text color={'gray.bone'} fontSize={'sm'} fontWeight="500">
                Ingredients
              </Text>
              <Text color="black" fontWeight="600" fontSize={'1.5rem'}>
                {ingredientsCount}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Flex justifyContent={'end'}>
          <ArrowForwardIcon fontSize={'1.5rem'} fontWeight={'600'} />
        </Flex>
      </Box>
    </BorderBox>
  );
};

export default MealPlan;
