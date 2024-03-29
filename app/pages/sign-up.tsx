import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { passwordStrength } from 'check-password-strength';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/layout';
import { CustomNextPage } from '../types/CustomNextPage';
import { createUser } from '../utils/requests/user';

const isPasswordStrongEnough = (password: string) => {
  const passwordOutput = passwordStrength(password);
  if (passwordOutput.length > 7 && passwordOutput.contains.length > 2) {
    return true;
  } else {
    return false;
  }
};

const SignUp: CustomNextPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const signInErrorToastId = 'sign-in';
  const isLargerThan800 = window.innerWidth > 800;

  const signUpMutation = useMutation({
    mutationFn: ({
      email,
      firstName,
      lastName,
      password,
    }: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
    }) => {
      return createUser({ email, firstName, lastName, password });
    },
    onSuccess: (data) => {
      router.push(
        {
          pathname: '/sign-in',
          query: { newAccount: true },
        },
        '/sign-in', // "as" argument
      );
    },
    onError: (e) => {
      console.error(e);
      if (!toast.isActive(signInErrorToastId)) {
        toast({
          id: signInErrorToastId,
          title: 'Dang it!',
          description: 'Something went wrong signing you up! 😕',
          position: isLargerThan800 ? 'top' : 'bottom',
          status: 'error',
          isClosable: true,
        });
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }>();

  const onSubmit = (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    signUpMutation.mutate(data);
  };

  return (
    <Layout includeNavBar={false}>
      <Head>
        <title>Sign Up | Plan and Eat Well</title>
      </Head>

      <Flex
        minH={'100vh'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={5} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign up
            </Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool features ✌️
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <Stack
              as={'form'}
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
              spacing={'1rem'}
            >
              <HStack>
                <FormControl
                  id="firstName"
                  isRequired
                  isInvalid={!!errors.firstName}
                >
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    {...register('firstName', {
                      required: 'First name is required',
                    })}
                  />

                  <FormErrorMessage>
                    {errors.firstName && `${errors?.firstName.message}`}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  id="lastName"
                  isRequired
                  isInvalid={!!errors.lastName}
                >
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    {...register('lastName', {
                      required: 'Last name is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.lastName && `${errors?.lastName.message}`}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <FormControl id="email" isRequired isInvalid={!!errors.email}>
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
              <FormControl
                id="password"
                isRequired
                isInvalid={!!errors.password}
              >
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      validate: isPasswordStrongEnough,
                    })}
                    autoComplete="new-password"
                  />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>

                <FormHelperText color={errors.password ? 'red' : 'gray.500'}>
                  Ensure password is at least 8 characters long, contains a
                  lowercase, uppercase, symbol and/or a number
                </FormHelperText>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  size="lg"
                  bg={'brand.500'}
                  color={'white'}
                  _hover={{
                    bg: 'brand.600',
                  }}
                  type="submit"
                  isLoading={signUpMutation.isLoading}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user?{' '}
                  <NextLink href={'/sign-in'}>
                    <Text
                      display={'inline'}
                      color={'brand.400'}
                      cursor={'pointer'}
                      as="span"
                    >
                      Sign in
                    </Text>
                  </NextLink>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Layout>
  );
};

SignUp.requireAuth = false;
SignUp.displayName = 'SignUp';

export default SignUp;
