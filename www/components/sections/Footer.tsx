import {
  chakra,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import Image from 'next/image';
import ChakraNextLink from '../NextChakraLink';

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

export default function Footer() {
  return (
    <Container as={Stack} maxW="1200px" my={10} py={{ base: 'none', sm: 5 }}>
      <SimpleGrid
        templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 2fr' }}
        spacing={8}
      >
        <Stack spacing={6}>
          <ChakraNextLink
            position={'relative'}
            w="11rem"
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
          <Text fontSize={'sm'}>
            © 2022 Plan and Eat Well. All rights reserved.
          </Text>
          <Stack direction={'row'} spacing={6}>
            <SocialButton label={'YouTube'} href={'#'}>
              <FaYoutube />
            </SocialButton>
            <SocialButton
              label={'Instagram'}
              href="https://www.instagram.com/planandeatwell/"
            >
              <FaInstagram />
            </SocialButton>
          </Stack>
        </Stack>
        <Stack align={'flex-start'}>
          <ListHeader>Company</ListHeader>
          <Link href={'#'}>About us</Link>
          <Link href={`${process.env.NEXT_PUBLIC_WWW_URL}/contact`}>
            Contact us
          </Link>
        </Stack>
        <Stack align={'flex-start'}>
          <ListHeader>Support</ListHeader>
          <Link
            href={`${process.env.NEXT_PUBLIC_WWW_URL}/terms-and-conditions`}
          >
            Terms and conditions
          </Link>
          <Link href={`${process.env.NEXT_PUBLIC_WWW_URL}/privacy`}>
            Privacy Policy
          </Link>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
