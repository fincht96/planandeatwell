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
import {
  SlMenu,
  SlNotebook,
  SlPlus,
  SlSettings,
  SlUserFollowing,
} from 'react-icons/sl';
import { useAuth } from '../contexts/auth-context';
import ChakraNextLink from './NextChakraLink';
interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}
const LinkItems: Array<LinkItemProps> = [
  {
    name: 'Create meal plan',
    icon: SlPlus,
    href: '/create-plan',
  },
  { name: 'My meal plans', icon: SlNotebook, href: '/meal-plans' },
  { name: 'Settings', icon: SlSettings, href: '#' },
];

export default function SidebarWithHeader({
  children,
  recipeBasketButton,
}: {
  children: ReactNode;
  recipeBasketButton?: any;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.lighterGray', 'gray.900')}>
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
      bg={useColorModeValue('gray.lighterGray', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: '16rem' }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        h="6.5rem"
        alignItems="center"
        mx="8"
        justifyContent="space-between"
      >
        <Box
          cursor={'pointer'}
          onClick={() => router.push('/create-plan/steps')}
        >
          <Image src="/images/logo.png" height={45} width={176} alt={'logo'} />
        </Box>
        <CloseButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onClose}
          size="1rem"
        />
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
        p="1.25rem"
        mx="1.25rem"
        borderRadius="xl"
        role="group"
        cursor="pointer"
        bg={selected ? 'brand.500' : 'gray.lighterGray'}
        height="3.5rem"
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="1.3rem"
            as={icon}
            color={selected ? 'white' : 'gray.bone'}
          />
        )}
        <Text
          fontSize="sm"
          fontWeight="600"
          color={selected ? 'white' : 'gray.bone'}
          _hover={{
            color: selected ? 'white' : 'brand.500',
          }}
        >
          {children}
        </Text>
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
      bg={useColorModeValue('gray.lighterGray', 'gray.900')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="unstyled"
        aria-label="open menu"
        icon={<SlMenu fontSize="1.3rem" color="black" />}
      />

      <HStack spacing={{ base: '0', md: '6' }}>
        <Box display={{ base: 'none', md: 'flex' }}>{recipeBasketButton}</Box>
        <Flex alignItems={'center'} p="0.3rem">
          <Menu>
            <MenuButton
              borderRadius="lg"
              p="1.25rem"
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
              _hover={{ background: 'brand.100' }}
            >
              <HStack>
                <Box>
                  <SlUserFollowing fontSize="1.3rem" />
                </Box>
                <VStack alignItems="flex-start" spacing="1px" ml="2">
                  <Text
                    fontSize="sm"
                    fontWeight="700"
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
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('gray.lighterGray', 'gray.900')}
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
