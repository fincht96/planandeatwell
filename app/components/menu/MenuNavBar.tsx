import {
  Box,
  BoxProps,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactNode, ReactText } from 'react';
import { IconType } from 'react-icons';
import { BiBookContent } from 'react-icons/bi';
import { FiChevronDown, FiMenu, FiSettings } from 'react-icons/fi';
import { IoAddOutline } from 'react-icons/io5';
import { useAuth } from '../../contexts/auth-context';
import ChakraNextLink from '../NextChakraLink';

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Create a meal plan', icon: IoAddOutline, href: '/create-plan' },
  { name: 'My meal plans', icon: BiBookContent, href: '/meal-plans' },
  { name: 'Settings', icon: FiSettings, href: '#' },
];

export default function SidebarWithHeader({
  children,
  recipeBasketButton,
}: {
  children?: ReactNode;
  recipeBasketButton: any;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('white', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} recipeBasketButton={recipeBasketButton} />
      <Box ml={{ base: 0, md: 60 }} py="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const router = useRouter();

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image src="/images/logo.png" height={45} width={176} alt={'logo'} />

        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => {
        return (
          <NavItem
            key={link.name}
            icon={link.icon}
            href={link.href}
            selected={router.pathname.includes(link.href)}
          >
            {link.name}
          </NavItem>
        );
      })}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  selected?: boolean;
  href: string;
}

const NavItem = ({
  icon,
  children,
  href,
  selected = false,
  ...rest
}: NavItemProps) => {
  return (
    <ChakraNextLink href={href} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={selected ? 'gray.100' : 'white'}
        fontWeight={selected ? '600' : '400'}
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        {children}
      </Flex>
    </ChakraNextLink>
  );
};

interface MobileProps extends FlexProps {
  recipeBasketButton: React.ReactElement;
  onOpen: () => void;
}

const MobileNav = ({ onOpen, recipeBasketButton, ...rest }: MobileProps) => {
  const { signOut, user } = useAuth();
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <HStack spacing={{ base: '0', md: '6' }}>
        <Box display={{ base: 'none', md: 'flex' }}>{recipeBasketButton}</Box>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <VStack alignItems="flex-start" spacing="1px" ml="2">
                  <Text
                    fontSize="1.2rem"
                    color="gray.600"
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    maxW={{
                      base: '5rem',
                      sm: '8rem',
                      md: '10rem',
                      lg: '15rem',
                    }}
                    whiteSpace={'nowrap'}
                  >
                    {user?.displayName ?? 'User'}
                  </Text>
                </VStack>
                <Box>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem
                onClick={() => {
                  if (signOut) {
                    signOut();
                  }
                }}
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};