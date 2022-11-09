import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Collapse,
  Flex,
  Icon,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import MenuButton from './MenuButton';

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();
  const [isLessThan500] = useMediaQuery('(max-width: 500px)');

  const router = useRouter();

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
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        ></Flex>
        <Flex
          alignItems={'center'}
          flex={{ base: 1.5 }}
          justify={{ base: 'center', md: 'start' }}
        >
          <NextLink href={'https://planandeatwell.uk'} passHref={true}>
            <Link>
              {!!isLessThan500 && (
                <Box position={'relative'} width={55} height={55}>
                  <Image
                    quality={75}
                    src="/favicon/apple-touch-icon.png"
                    layout={'fill'}
                    alt={'logo'}
                    objectFit={'cover'}
                  />
                </Box>
              )}

              {!isLessThan500 && (
                <Image
                  src="/images/logo.png"
                  height={45}
                  width={176}
                  alt={'logo'}
                />
              )}
            </Link>
          </NextLink>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            {/* <DesktopNav /> */}
          </Flex>
        </Flex>

        <Stack
          flex={1}
          flexDirection={'row-reverse'}
          alignItems={'flex-end'}
          gap={'1rem'}
        >
          <MenuButton onClick={onToggle} />
          <Button
            bg={'#ffffff'}
            border={'solid 1px'}
            borderColor={'brand.500'}
            color={'brand.500'}
            fontSize={'1rem'}
            fontWeight={400}
            // onClick={() => {
            //   router.push('/steps');
            // }}
            alignContent={'center'}
            // display={'flex'}
            as={Link}
            href={'/'}
            isExternal
            _hover={{
              // color: 'red',
              textDecoration: 'none',
              background: 'gray.100',
            }}
            display={{ base: 'none', md: 'flex' }}
          >
            Create new meal plan
          </Button>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav toggleShowNav={onToggle} />
      </Collapse>
    </Box>
  );
}

const MobileNav = ({ toggleShowNav }: any) => {
  const [isLessThan768] = useMediaQuery('(max-width: 768px)');
  const navItems = isLessThan768
    ? [{ label: 'Create new meal plan', href: '/' }, ...NAV_ITEMS]
    : NAV_ITEMS;

  return (
    <Stack bg={useColorModeValue('white', 'gray.800')} p={4}>
      {navItems.map((navItem) => (
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
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
          onClick={toggleShowNav}
          _hover={{
            color: 'brand.500',
            textDecoration: 'underline',
          }}
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
    label: 'What is it?',
    href: 'https://planandeatwell.uk#what-is-it',
  },
  {
    label: 'How it works',
    href: 'https://planandeatwell.uk#how-it-works',
  },
  {
    label: 'Contact',
    href: 'https://planandeatwell.uk#contact',
  },
];
