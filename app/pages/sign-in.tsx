import {
  Alert,
  AlertIcon,
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/layout';
import ChakraNextLink from '../components/NextChakraLink';
import { useAuth } from '../contexts/auth-context';
import { CustomNextPage } from '../types/CustomNextPage';
import { Event } from '../types/eventBus.types';

const SignIn: CustomNextPage = () => {
  const router = useRouter();
  const { signIn, unsubscribe, subscribe } = useAuth();
  const [loading, setLoading] = useState(false);

  const { isOpen: isNewAccountAlertVisible, onClose: onCloseNewAccountAlert } =
    useDisclosure({ defaultIsOpen: false, isOpen: !!router.query.newAccount });

  const {
    isOpen: userRequestedPasswordReset,
    onClose: onCloseRequestedPasswordReset,
  } = useDisclosure({
    defaultIsOpen: false,
    isOpen: !!router.query.userRequestPasswordReset,
  });

  const {
    isOpen: signInErrorAlertVisible,
    onClose: onCloseSignInErrorAlert,
    onOpen: onOpenSignInErrorAlert,
  } = useDisclosure({
    defaultIsOpen: false,
  });

  useEffect(() => {
    const authSubscriber = {
      notify(event: Event) {
        if (event.name === 'onSignIn') {
          setLoading(false);
        }
        if (event.name === 'onError') {
          setLoading(false);
          onOpenSignInErrorAlert();
        }
      },
    };

    if (subscribe) {
      subscribe(authSubscriber);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe(authSubscriber);
      }
    };
  }, [onOpenSignInErrorAlert, subscribe, unsubscribe]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();

  const onSubmit = (data: { email: string; password: string }) => {
    const { email, password } = data;
    if (signIn) {
      setLoading(true);
      signIn(email, password);
    }
  };

  return (
    <Layout includeNavBar={false}>
      <Head>
        <title>Sign In | Plan and Eat Well</title>
      </Head>

      {userRequestedPasswordReset && (
        <Alert
          status="success"
          as={Flex}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Flex>
            <AlertIcon />
            Success, you will receive an email with instructions on how to reset
            your password in a few minutes! 😅
          </Flex>
          <CloseButton onClick={onCloseRequestedPasswordReset} />
        </Alert>
      )}

      {isNewAccountAlertVisible && (
        <Alert
          status="success"
          as={Flex}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Flex>
            <AlertIcon />
            Awesome, your account has been created! 🚀
          </Flex>
          <CloseButton onClick={onCloseNewAccountAlert} />
        </Alert>
      )}

      {signInErrorAlertVisible && (
        <Alert
          status="error"
          as={Flex}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Flex>
            <AlertIcon />
            Oops, something went wrong signing you in! 😕
          </Flex>
          <CloseButton onClick={onCloseSignInErrorAlert} />
        </Alert>
      )}

      <Flex
        minH={'100vh'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Sign in to your account</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool{' '}
              <Link color={'brand.400'} href={process.env.NEXT_PUBLIC_WWW_URL}>
                features
              </Link>{' '}
              ✌️
            </Text>
          </Stack>
          <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.email && `${errors?.email.message}`}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    {...register('password', {
                      required: 'Password is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.password && `${errors?.password.message}`}
                  </FormErrorMessage>
                </FormControl>
                <Stack spacing={10}>
                  <Flex
                    wrap={'wrap'}
                    align={'start'}
                    justify={'flex-end'}
                    gap={'1rem'}
                  >
                    <ChakraNextLink
                      color={'brand.400'}
                      href={'/reset-password'}
                    >
                      Forgot password?
                    </ChakraNextLink>
                  </Flex>
                  <Button
                    bg={'brand.500'}
                    color={'white'}
                    _hover={{
                      bg: 'brand.600',
                    }}
                    type="submit"
                    isLoading={loading}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </form>
            <Stack pt={6}>
              <Text align={'center'}>
                Don&apos;t have an account?{' '}
                <NextLink href={'/sign-up'}>
                  <Text
                    display={'inline'}
                    color={'brand.400'}
                    cursor={'pointer'}
                    as={'span'}
                  >
                    Sign up
                  </Text>
                </NextLink>
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Layout>
  );
};

SignIn.requireAuth = false;
SignIn.displayName = 'SignIn';

export default SignIn;
