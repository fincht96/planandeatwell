import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
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
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/layout';
import { CustomNextPage } from '../types/CustomNextPage';
import { createUser } from '../utils/requests/user';

const SignUp: CustomNextPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    isOpen: signUpErrorAlertVisible,
    onClose: onCloseSignUpErrorAlert,
    onOpen: onOpenSignUpErrorAlert,
  } = useDisclosure({
    defaultIsOpen: false,
  });

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
      onOpenSignUpErrorAlert();
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

      {signUpErrorAlertVisible && (
        <Alert
          status="error"
          as={Flex}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Flex>
            <AlertIcon />
            Dang it! Something went wrong signing you up! 😕
          </Flex>
          <CloseButton onClick={onCloseSignUpErrorAlert} />
        </Alert>
      )}

      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
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
            <Stack spacing={4}>
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <HStack>
                  <Box>
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
                  </Box>
                  <Box>
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
                  </Box>
                </HStack>
                <FormControl id="email" isRequired isInvalid={!!errors.email}>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                    })}
                    autoComplete="off"
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
                      })}
                      autoComplete="off"
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

                  <FormErrorMessage>
                    {errors.password && `${errors?.password.message}`}
                  </FormErrorMessage>
                </FormControl>
                <Stack spacing={10} pt={2}>
                  <Button
                    loadingText="Submitting"
                    size="lg"
                    bg={'brand.500'}
                    color={'white'}
                    _hover={{
                      bg: 'brand.600',
                    }}
                    type="submit"
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
              </form>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Layout>
  );
};

SignUp.requireAuth = false;

export default SignUp;
