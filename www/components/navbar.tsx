import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import React from 'react';
import ChakraNextLink from './NextChakraLink';

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box sx={{ position: 'fixed', top: '0px', width: '100%', zIndex: '3' }}>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
      >
        <Flex alignItems={'center'} flex={{ base: 1.5 }} justify={'start'}>
          <ChakraNextLink
            position={'relative'}
            w={{ base: '11rem', md: '15rem' }}
            h={{ base: '2.2rem', sm: '3rem' }}
            p={0}
            href={'/'}
          >
            <Image
              quality={75}
              src="/images/logo.png"
              layout={'fill'}
              alt={'logo'}
              objectFit={'contain'}
            />
          </ChakraNextLink>

          <Flex display={{ base: 'none', lg: 'flex' }} ml={'1rem'}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Flex gap={{ base: '0.5rem', md: '1rem' }} alignItems={'center'}>
          <Button
            bg={'#ffffff'}
            color={'brand.500'}
            fontSize={'1.2rem'}
            fontWeight={400}
            alignContent={'center'}
            as={Link}
            href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}/sign-in`}
            _hover={{
              textDecoration: 'none',
              background: 'gray.100',
            }}
            padding={{ base: '0.5rem', md: '1.2rem' }}
          >
            Sign In
          </Button>

          <Button
            colorScheme={'brand'}
            fontSize={'1.2rem'}
            fontWeight={500}
            alignContent={'center'}
            as={Link}
            _hover={{
              textDecoration: 'none',
              backgroundColor: 'brand.600',
            }}
            href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}/sign-up`}
            padding={{ base: '0.5rem', md: '1.2rem' }}
            display={{ base: 'none', md: 'flex' }}
          >
            Get started
          </Button>

          <Flex
            ml={{ base: -2 }}
            flex={{ base: 1, md: 'auto' }}
            display={{ base: 'flex', lg: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav toggleShowNav={onToggle} />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkHoverColor = useColorModeValue('brand.500', 'white');

  return (
    <Stack direction={'row'} spacing={4} alignItems={'center'}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <ChakraNextLink
                p={2}
                href={navItem.href ?? '#'}
                fontSize={'1.2rem'}
                fontWeight={400}
                color={'gray.dark'}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </ChakraNextLink>
            </PopoverTrigger>
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = ({ toggleShowNav }: any) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ base: 'flex', lg: 'none' }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem
          key={navItem.label}
          {...navItem}
          toggleShowNav={toggleShowNav}
        />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href, toggleShowNav }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children ? onToggle : toggleShowNav}>
      <Flex
        py={2}
        as={ChakraNextLink}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text fontWeight={400} color={'gray.dark'} onClick={toggleShowNav}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  toggleShowNav?: any;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'What is it?',
    href: '/#what-is-it',
  },
  {
    label: 'How it works',
    href: '/#how-it-works',
  },
  {
    label: 'Recipes',
    href: '/recipes',
  },
];
