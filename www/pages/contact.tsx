import { Container } from '@chakra-ui/react';
import Head from 'next/head';
import Layout from '../components/layout';
import { Text, Link } from '@chakra-ui/react';
import { forwardRef, Box, TextProps } from '@chakra-ui/react';

const Title = forwardRef<TextProps, 'h1'>((props, ref) => (
  <Text color="gray.dark" fontSize={'36px'} ref={ref} as={'h1'} {...props} />
));

const Heading = forwardRef<TextProps, 'h3'>((props, ref) => (
  <Text fontSize={'24px'} ref={ref} as={'h3'} {...props} />
));

const MainText = forwardRef<TextProps, 'p'>((props, ref) => (
  <Text
    fontSize={'16'}
    color="gray.normal"
    fontWeight={400}
    ref={ref}
    {...props}
  />
));

export default function Contact() {
  return (
    <Layout>
      <Head>
        <title>Contact</title>
      </Head>

      <Container
        maxW="1200px"
        mt={'5rem'}
        mb={20}
        sx={{ position: 'relative' }}
      >
        <Box mb={5}>
          <Title mb={2}>Contact</Title>
          <MainText>
            <Text fontSize="16px" color="gray.normal" fontWeight={400}>
              If you have any questions email us at&nbsp;
              <Link
                fontWeight={500}
                href="mailto:support@planandeatwell.uk"
                isExternal
              >
                support@planandeatwell.uk
              </Link>
              &nbsp;or drop us a message on Instagram
            </Text>
          </MainText>
        </Box>
      </Container>
    </Layout>
  );
}
