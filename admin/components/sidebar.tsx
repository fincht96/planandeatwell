import {
  Box,
  BoxProps,
  Button,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { FiMenu } from 'react-icons/fi';

import Image from 'next/image';
import { ReactText } from 'react';
import { IconType } from 'react-icons';

import NextLink from 'next/link';
import { useAuth } from '../contexts/auth-context';

interface LinkItemProps {
  name: string;
  icon: IconType | null;
  href: string;
}
const LinkItems: Array<LinkItemProps> = [
  // { name: 'Home', icon: FiHome },
  { name: 'Recipes', icon: FiMenu, href: '/recipes' },
  { name: 'Ingredients', icon: FiMenu, href: '/ingredients' },
];

const Logo = () => {
  return (
    <Flex alignItems={'center'} gap={'1rem'}>
      <Box position={'relative'} width={55} height={55}>
        <Image
          quality={75}
          src="/favicon/apple-touch-icon.png"
          layout={'fill'}
          alt={'logo'}
          objectFit={'cover'}
        />
      </Box>
      <Text>Admin Dashboard</Text>
    </Flex>
  );
};

export default function SimpleSidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', lg: 'block' }}
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
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', lg: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, lg: '20rem' }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { logout } = useAuth();
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', lg: '20rem' }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Logo />
        <CloseButton display={{ base: 'flex', lg: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} href={link.href}>
          {link.name}
        </NavItem>
      ))}

      <Button onClick={() => logout()}>Log out</Button>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}
const NavItem = ({ icon, href, children, ...rest }: NavItemProps) => {
  return (
    <NextLink
      href={href}
      style={{ textDecoration: 'none', boxShadow: 'none' }}
      // _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'brandSecondary.500',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </NextLink>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      gap={'1rem'}
      ml={{ base: 0, lg: 60 }}
      px={{ base: 4, lg: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Logo />
    </Flex>
  );
};
