import { registerEmail } from '../util/api-requests/email_requests';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  useToast,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Text,
} from '@chakra-ui/react';
import { ApiResp } from '../util/api-requests/response_type';
import { capitalizeFirstLetter } from '../util/helper/capitalize_first_letter';
import * as ga from '../lib/gtag';

type Inputs = {
  email: string;
};

const SignupForm = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<Inputs>();

  const toast = useToast();

  async function onSubmit(values: Inputs) {
    const emailRegisterRes: ApiResp = await registerEmail(values.email);

    const { errors } = emailRegisterRes;

    ga.event({
      action: 'email_submission',
      category: 'user_input',
      label: 'user_register_interest',
      value: errors.length ? `error: ${errors[0]}` : 'success',
    });

    const title = errors.length ? 'Error!' : 'Success!';
    const description = errors.length
      ? capitalizeFirstLetter(errors[0])
      : 'Your email has been successfully registered.';

    const status = errors.length ? 'error' : 'success';

    toast({
      position: 'top',
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
    });
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ email: '' });
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <FormControl isInvalid={!!errors.email}>
        <Text
          fontSize={{ base: '5vw', sm: '4vw', md: '20px' }}
          color="gray.normal"
          fontWeight={400}
          mb={5}
        >
          Join the waiting list
        </Text>

        <Input
          id="email"
          placeholder="Email"
          fontSize={{ base: '5vw', sm: '4vw', md: '20px' }}
          autoComplete="off"
          w={'20em'}
          {...register('email', {
            required: 'This is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Provide a valid email',
            },
          })}
        />
        <FormErrorMessage>
          {!!errors.email && `${errors.email?.message}`}
        </FormErrorMessage>
      </FormControl>
      <Button
        mt={4}
        colorScheme="brand"
        maxW="min-content"
        fontSize={{ base: '5vw', sm: '4vw', md: '20px' }}
        fontWeight={400}
        padding={'10px 25px'}
        isLoading={isSubmitting}
        type="submit"
      >
        Submit
      </Button>
    </form>
  );
};

export default SignupForm;
