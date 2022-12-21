import {
  Button,
  FormControl,
  FormErrorMessage,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GoSearch } from 'react-icons/go';
import { MdOutlineClear } from 'react-icons/md';

const SearchField = React.forwardRef<any>((props: any, ref: any) => {
  const {
    onSearchSubmit,
    minLength = 2,
    maxLength = 200,
    value,
    ...rest
  } = props;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue('searchTerm', value);
  }, [value, setValue]);

  return (
    <FormControl isInvalid={!!errors.searchTerm} {...rest}>
      <form onSubmit={handleSubmit(onSearchSubmit)} autoComplete="off">
        <InputGroup>
          <InputLeftAddon as={Button} type="submit">
            <Icon as={GoSearch} w={'1rem'} h={'1rem'} color={'gray.light'} />
          </InputLeftAddon>
          <Input
            type="text"
            placeholder="Search"
            errorBorderColor={'default'}
            {...register(`searchTerm`, {
              minLength: {
                value: minLength,
                message: `Search term must be at least ${minLength} characters`,
              },
              maxLength: {
                value: maxLength,
                message: `Search term must be less than ${maxLength} characters`,
              },
            })}
            bg={'white'}
          />

          <InputRightAddon
            as={Button}
            bg={'white'}
            onClick={() => {
              reset();
              onSearchSubmit({ searchTerm: '' });
            }}
            _hover={{ bg: 'white' }}
            disabled={!watch('searchTerm')?.length}
          >
            <Icon
              as={MdOutlineClear}
              w={'1rem'}
              h={'1rem'}
              color={'gray.light'}
            />
          </InputRightAddon>
        </InputGroup>

        <FormErrorMessage color={'#4d4d4d'}>
          {errors.searchTerm && `${errors?.searchTerm.message}`}
        </FormErrorMessage>
      </form>
    </FormControl>
  );
});

SearchField.displayName = 'SearchField';

export default SearchField;
