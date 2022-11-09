import { HamburgerIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text } from '@chakra-ui/react';

const MenuButton = ({ onClick }: { onClick: any }) => {
  return (
    <Button variant="outline" maxWidth={'min-content'} onClick={onClick}>
      <Box display={'flex'} justifyContent={'center'}>
        <Stack direction={'row'} alignItems={'center'}>
          <HamburgerIcon color={'brand.500'} />
          <Text fontSize={'1rem'} color="gray.normal" fontWeight={400} mb={5}>
            Menu
          </Text>
        </Stack>
      </Box>
    </Button>
  );
};

export default MenuButton;
