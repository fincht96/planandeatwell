import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SlClose, SlMagnifier } from 'react-icons/sl';

const SearchField = (props: any) => {
  const {
    searchFieldParentMargin,
    searchFieldWidth,
    searchFieldBgColor,
    searchFieldBorder,
    searchFieldParentWidth,
    searchFieldTextColor,
    searchFieldHeight,
    searchFieldFontSize,
    searchFieldPlaceHolderText,
    searchFieldFontWeight,
    onSearchSubmit,
    minLength = 2,
    maxLength = 200,
    value,
  } = props;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue('searchTerm', value);
  }, [value, setValue]);

  return (
    <Box
      width={searchFieldParentWidth}
      m={searchFieldParentMargin}
      mb={{ base: '1rem', xl: '0' }}
    >
      <FormControl isInvalid={!!errors.searchTerm}>
        <form onSubmit={handleSubmit(onSearchSubmit)} autoComplete="off">
          <InputGroup>
            <InputLeftAddon
              as={Button}
              type="submit"
              height={searchFieldHeight}
              bg={searchFieldBgColor}
              border={searchFieldBorder}
              cursor="pointer"
              _hover={{
                bg: 'brand.100',
                color: 'black',
              }}
            >
              <Icon as={SlMagnifier} fontSize="1rem" color="black" />
            </InputLeftAddon>
            <Input
              type="text"
              width={searchFieldWidth}
              color={searchFieldTextColor}
              fontSize={searchFieldFontSize}
              fontWeight={searchFieldFontWeight}
              border={searchFieldBorder}
              height={searchFieldHeight}
              bg={searchFieldBgColor}
              placeholder={searchFieldPlaceHolderText}
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
            />
            <InputRightAddon
              border={searchFieldBorder}
              height={searchFieldHeight}
              as={Button}
              bg={searchFieldBgColor}
              onClick={() => {
                reset();
                onSearchSubmit({ searchTerm: '' });
              }}
              _hover={{ bg: 'brand.100', color: 'black' }}
            >
              <Icon as={SlClose} fontSize="1rem" color="gray.400" />
            </InputRightAddon>
          </InputGroup>
          <FormErrorMessage color={'red'}>
            {errors.searchTerm && `${errors?.searchTerm.message}`}
          </FormErrorMessage>
        </form>
      </FormControl>
    </Box>
  );
};

SearchField.displayName = 'SearchField';

export default SearchField;
