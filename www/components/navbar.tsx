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
        bg={useColorModeValue('gray.lighterGray', 'gray.800')}
        color={useColorModeValue('gray.dark', 'white')}
        minH={'80px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={'center'}
      >
        <Flex>
          <ChakraNextLink
            position={'relative'}
            w="11rem"
            h={{ base: '2.5rem', sm: '3rem' }}
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
        </Flex>
        <Flex alignItems={'center'} flex={{ base: 1.5 }} justify={'center'}>
          <Flex
            display={{ base: 'none', lg: 'flex' }}
            alignItems={'center'}
            flex={{ base: 1.5 }}
            justify={'center'}
          >
            <DesktopNav />
          </Flex>
        </Flex>

        <Flex gap={{ base: '0.5rem', md: '1rem' }} alignItems={'center'}>
          <Button
            bg={'gray.veryLightGray'}
            color="gray.dark"
            fontSize="md"
            fontWeight={600}
            alignContent={'center'}
            as={Link}
            href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}/sign-in`}
            _hover={{
              textDecoration: 'none',
              background: 'gray.100',
            }}
            padding={{ base: '0.5rem', md: '1.2rem' }}
            display={{ base: 'none', lg: 'flex' }}
          >
            Sign In
          </Button>

          <Button
            colorScheme={'brand'}
            fontSize="md"
            fontWeight={600}
            alignContent={'center'}
            as={Link}
            _hover={{
              textDecoration: 'none',
              backgroundColor: 'brand.600',
            }}
            href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}/sign-up`}
            padding={{ base: '0.5rem', md: '1.2rem' }}
            display={{ base: 'none', lg: 'flex' }}
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
    <Stack
      direction={'row'}
      spacing={4}
      alignItems={'center'}
      justifyContent="center"
    >
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <ChakraNextLink
                p={2}
                href={navItem.href ?? '#'}
                fontSize="md"
                fontWeight={600}
                color="black"
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
  const signInAndGetStarted = [
    {
      label: 'Sign in',
      href: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/sign-in`,
    },
    {
      label: 'Get started',
      href: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/sign-up`,
    },
  ];

  return (
    <Stack
      bg={useColorModeValue('gray.50', 'gray.800')}
      p={4}
      display={{ base: 'flex', lg: 'none' }}
    >
      {NAV_ITEMS.concat(signInAndGetStarted).map((navItem) => (
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
        <Text
          fontSize="md"
          fontWeight={600}
          color="black"
          onClick={toggleShowNav}
        >
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
    label: 'How it works',
    href: '/#how-it-works',
  },
  {
    label: 'Video',
    href: '/#video',
  },
  {
    label: 'Support',
    href: '/#faq',
  },
  {
    label: 'Recipes',
    href: '/recipes',
  },
];
