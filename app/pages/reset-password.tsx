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
import { useAuth } from '../contexts/auth-context';
import { CustomNextPage } from '../types/CustomNextPage';
import { Event } from '../types/eventBus.types';

const ResetPassword: CustomNextPage = () => {
  const router = useRouter();
  const { unsubscribe, subscribe, sendPasswordResetEmail } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    isOpen: resetPasswordErrorAlertVisible,
    onClose: onCloseResetPasswordErrorAlert,
    onOpen: onOpenResetPasswordErrorAlert,
  } = useDisclosure({
    defaultIsOpen: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();

  const onSubmit = (data: { email: string }) => {
    if (sendPasswordResetEmail) {
      setLoading(true);
      sendPasswordResetEmail(data.email);
    }
  };

  useEffect(() => {
    const authSubscriber = {
      notify(event: Event) {
        setLoading(false);
        if (event.name === 'onPasswordResetEmailSent') {
          // navigate to sign in with success snack bar
          router.push(
            {
              pathname: '/sign-in',
              query: { userRequestPasswordReset: true },
            },
            '/sign-in',
          );
        }
        if (event.name === 'onError') {
          // show error snackbar
          console.log('error password reset email link not sent');
          onOpenResetPasswordErrorAlert();
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
  }, [onOpenResetPasswordErrorAlert, router, subscribe, unsubscribe]);

  return (
    <Layout includeNavBar={false}>
      <Head>
        <title>Plan and Eat Well</title>
      </Head>

      {resetPasswordErrorAlertVisible && (
        <Alert
          status="error"
          as={Flex}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Flex>
            <AlertIcon />
            Oops, something went wrong sending the password reset link! 😕
          </Flex>
          <CloseButton onClick={onCloseResetPasswordErrorAlert} />
        </Alert>
      )}

      <Flex
        minH={'100vh'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Reset Password</Heading>
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

                <Stack spacing={10}>
                  <Button
                    bg={'brand.500'}
                    color={'white'}
                    _hover={{
                      bg: 'brand.600',
                    }}
                    type="submit"
                    isLoading={loading}
                  >
                    Send password reset link
                  </Button>
                </Stack>
              </Stack>
            </form>
            <Stack pt={6}>
              <NextLink href={'/sign-in'}>
                <Text
                  display={'inline'}
                  color={'brand.400'}
                  cursor={'pointer'}
                  align={'center'}
                >
                  Sign in
                </Text>
              </NextLink>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Layout>
  );
};

ResetPassword.requireAuth = false;
ResetPassword.displayName = 'ResetPassword';

export default ResetPassword;
