import {
  Box,
  Button,
  Flex,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import CartMenu from './CartMenu';

export default function MenuSummaryBar({
  currentPrice,
  ingredientList,
  recipeIdList,
  servings,
  onComplete,
}: {
  currentPrice: number;
  ingredientList: any;
  recipeIdList: any;
  servings: any;
  onComplete: any;
}) {
  const { isOpen, onToggle } = useDisclosure();
  const [isLessThan500] = useMediaQuery('(max-width: 500px)');

  return (
    <Box sx={{ position: 'fixed', bottom: '0px', width: '100%', zIndex: '3' }}>
      <Flex
        bg={useColorModeValue('#D9D9D9', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        justifyContent={{ base: 'space-between', md: 'flex-end' }}
      >
        <CartMenu
          currentPrice={currentPrice}
          ingredientList={ingredientList}
          recipeIdList={recipeIdList}
          servings={servings}
          disabled={!recipeIdList.length}
        />

        <Button
          colorScheme="brand"
          fontSize={'1.2rem'}
          fontWeight={600}
          ml={'1rem'}
          padding={'1.5rem 1.5rem'}
          disabled={!recipeIdList.length}
          onClick={onComplete}
        >
          Complete
        </Button>
      </Flex>
    </Box>
  );
}
