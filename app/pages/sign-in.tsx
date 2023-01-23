import {
  Box,
  Button,
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
  useToast,
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
  const toast = useToast();
  const isLargerThan800 = window.innerWidth > 800;
  const passwordResetToastId = 'password-reset';
  const newAccountToastId = 'new-account';
  const signInErrorToastId = 'sign-in';

  useEffect(() => {
    if (
      !!router.query.userRequestPasswordReset &&
      !toast.isActive(passwordResetToastId)
    ) {
      toast({
        id: passwordResetToastId,
        title: 'Success',
        description: `You will shortly receive an email with instructions on how to reset
              your password in a few minutes! 😅`,
        position: isLargerThan800 ? 'top' : 'bottom',
        status: 'success',
        isClosable: true,
        duration: 6000,
      });

      router.replace('/sign-in', undefined, { shallow: true });
    }
  }, [isLargerThan800, router, router.query.userRequestPasswordReset, toast]);

  useEffect(() => {
    if (!!router.query.newAccount && !toast.isActive(newAccountToastId)) {
      toast({
        id: newAccountToastId,
        title: 'Awesome',
        description: `Awesome, your account has been created! 🚀`,
        position: isLargerThan800 ? 'top' : 'bottom',
        status: 'success',
        isClosable: true,
      });
      router.replace('/sign-in', undefined, { shallow: true });
    }
  }, [isLargerThan800, router, router.query.newAccount, toast]);

  useEffect(() => {
    const authSubscriber = {
      notify(event: Event) {
        if (event.name === 'onSignIn') {
          setLoading(false);
        }
        if (event.name === 'onError') {
          setLoading(false);
          if (!toast.isActive(signInErrorToastId)) {
            toast({
              id: signInErrorToastId,
              title: 'Oops',
              description: 'Something went wrong signing you in 😕',
              position: isLargerThan800 ? 'top' : 'bottom',
              status: 'error',
              isClosable: true,
            });
          }
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
  }, [isLargerThan800, subscribe, toast, unsubscribe]);

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
