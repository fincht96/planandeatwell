import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Text } from '@chakra-ui/react';
import BorderBox from '../BorderBox';
import ChakraNextLink from '../NextChakraLink';

const MealPlan = ({ uuid, name }: { uuid: string; name: string }) => {
  return (
    <BorderBox height={'7rem'} overflow={'hidden'}>
      <Box p={'6'}>
        <Box mt={'1'} noOfLines={1}>
          <Text fontSize={'1.5rem'} fontWeight={450} color="gray.dark">
            {name}
          </Text>
        </Box>

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
