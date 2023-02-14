import { registerEmail } from '../utils/api-requests/email_requests';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  useToast,
  FormErrorMessage,
  FormControl,
  Input,
  Button,
  Flex,
} from '@chakra-ui/react';
import { ApiResp } from '../utils/api-requests/response_type';
import { capitalizeFirstLetter } from '../utils/helper/capitalize_first_letter';
import * as ga from '../lib/gtag';

type Inputs = {
  email: string;
};

const SignupForm = ({ campaignId }: { campaignId: number }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<Inputs>();

  const toast = useToast();

  async function onSubmit(values: Inputs) {
    const emailRegisterRes: ApiResp = await registerEmail(
      values.email,
      campaignId,
    );

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
        <Input
          id="email"
          placeholder="Enter your email"
          fontSize={{ base: '1rem', lg: '1.2rem' }}
          autoComplete="off"
          width="100%"
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
      <Flex justifyContent={{ base: 'center', lg: 'flex-start' }}>
        <Button
          mt={3}
          colorScheme="brand"
          fontSize="md"
          fontWeight="600"
          maxW="min-content"
          isLoading={isSubmitting}
          type="submit"
          padding="1.2rem"
        >
          Request early access
        </Button>
      </Flex>
    </form>
  );
};

export default SignupForm;
