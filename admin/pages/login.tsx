import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Meta from '../components/meta';
import { useAuth } from '../contexts/auth-context';

export default function Login() {
  const [isLoading, setLoading] = useState(false);
  const { currentUser, login, authLoading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      setIsReady(true);
    }
  }, [authLoading, currentUser]);

  useEffect(() => {
    currentUser
      ?.getIdTokenResult()
      .then((decodedToken) => {
        if (decodedToken?.claims?.roles?.includes('admin')) {
          router.push('/ingredients');
        } else {
          setIsReady(true);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, [currentUser, router]);

  const onSubmit = (data) => {
    setLoading(true);

    const { email, password } = data;
    login(email, password)
      .then(async (user) => {
        if (user.claims.roles.includes('admin')) {
          toast({
            position: 'top',
            title: 'Success!',
            description: 'Admin signed in',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            position: 'top',
            title: 'Error!',
            description: 'User does not have correct privileges',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setLoading(false);
        }
      })
      .catch((e) => {
        toast({
          position: 'top',
          title: 'Error!',
          description: 'An error occurred during log in, try again',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      });
  };

  return (
    <>
      <Meta />
      <Head>
        <title>Admin Dashboard | Plan and Eat Well</title>
      </Head>

      <main>
        {isReady && (
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <FormControl isInvalid={!!errors.email}>
              <Text>Email</Text>
              <Input
                variant="outline"
                autoComplete="off"
                bg={'#ffffff'}
                id={'email'}
                type={'text'}
                {...register('email', {
                  required: 'Email is required',
                })}
              />
              <FormErrorMessage>
                {errors.email && `${errors?.email.message}`}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <Text>Password</Text>
              <Input
                variant="outline"
                autoComplete="off"
                bg={'#ffffff'}
                id={'password'}
                type={'password'}
                {...register('password', {
                  required: 'Password is required',
                })}
              />
              <FormErrorMessage>
                {errors.password && `${errors?.password.message}`}
              </FormErrorMessage>
            </FormControl>

            <Button
              colorScheme={'brandSecondary'}
              type="submit"
              isLoading={isLoading}
            >
              Log in
            </Button>
          </form>
        )}
      </main>
    </>
  );
}
