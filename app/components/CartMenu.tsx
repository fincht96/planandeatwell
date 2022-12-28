import { ChevronUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  IconButton,
  Menu,
  MenuButton as ChakraMenuButton,
  MenuList,
  Text,
} from '@chakra-ui/react';

const CartMenu = ({
  currentPrice,
  recipeList,
  ingredientList,
  servings,
  disabled,
}: {
  currentPrice: number;
  recipeList: any;
  ingredientList: any;
  servings: number;
  disabled: boolean;
}) => (
  <Menu>
    {({ isOpen }) => (
      <>
        {isOpen && (
          <Box
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '120vw',
              height: '120vh',
              background: 'rgba(0, 0, 0, 0.5)',
            }}
          />
        )}
        <ChakraMenuButton
          as={IconButton}
          aria-label="Options"
          border={'none'}
          rightIcon={<ChevronUpIcon />}
          variant="outline"
          maxWidth={'min-content'}
          padding={'1.5rem 1.5rem'}
          background={'#ffffff'}
          _hover={{ bg: '#C8EFE2' }}
          _expanded={{ bg: '#C8EFE2' }}
          _focus={{ boxShadow: 'outline' }}
          disabled={disabled}
        >
          <Flex flexDirection={'column'}>
            <Text>£{currentPrice}</Text>
            <Text fontWeight={'200'} fontSize={'1rem'}>
              {servings} servings
            </Text>
          </Flex>
        </ChakraMenuButton>
        <MenuList maxW={'90vw'} maxH={'30rem'} overflowY={'auto'}>
          <Box p={'0.5rem'}>
            <Text
              fontSize={'1.2rem'}
              color="gray.dark"
              fontWeight={600}
              textAlign={'center'}
            >
              Meal plan
            </Text>
            <Text
              fontSize={'1rem'}
              color="gray.dark"
              fontWeight={400}
              textAlign={'center'}
            >
              4 servings per recipe
            </Text>
          </Box>

          <Box py={'1rem'}>
            <Divider />
          </Box>

          <Text
            fontSize={'1rem'}
            color="gray.dark"
            fontWeight={600}
            textAlign={'center'}
          >
            Recipes ({recipeList.length})
          </Text>

          {recipeList.map((recipe: any) => {
            return (
              <Box
                p={'0.5rem'}
                key={recipe.id}
                fontSize={'1rem'}
                color="gray.normal"
              >
                {recipe.name}
              </Box>
            );
          })}

          <Text
            fontSize={'1rem'}
            color="gray.dark"
            fontWeight={600}
            textAlign={'center'}
          >
            Ingredients ({ingredientList.length})
          </Text>

          {ingredientList.map((ingredient: any) => {
            return (
              <Box p={'0.5rem'} key={ingredient.id} color="gray.normal">
                £{ingredient.price} - {ingredient.unitQuantity} x{' '}
                {ingredient.name}
              </Box>
            );
          })}
        </MenuList>
      </>
    )}
  </Menu>
);

export default CartMenu;
