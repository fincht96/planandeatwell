import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SlArrowDown, SlMagnifier } from 'react-icons/sl';

const SearchField = React.forwardRef<any>((props: any, ref: any) => {
  const {
    showMobileView,
    handleSortChange,
    onSearchSubmit,
    minLength = 2,
    maxLength = 200,
    value,
    ...rest
  } = props;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue('searchTerm', value);
  }, [value, setValue]);

  return (
    <Box
      display="flex"
      flexDirection={showMobileView ? 'column' : 'row'}
      justifyContent="space-even"
    >
      <Box mr="1.25rem" width={showMobileView ? '100%' : '50%'}>
        <FormControl isInvalid={!!errors.searchTerm} {...rest}>
          <form onSubmit={handleSubmit(onSearchSubmit)} autoComplete="off">
            <InputGroup>
              <InputLeftAddon
                as={Button}
                type="submit"
                height={'3.5rem'}
                bg="gray.searchBoxGray"
                border="none"
                cursor="pointer"
                _hover={{
                  bg: 'brand.100',
                  color: 'black',
                }}
              >
                <Icon as={SlMagnifier} fontSize="1.3rem" color="black" />
              </InputLeftAddon>
              <Input
                width="100%"
                color="black"
                fontSize="sm"
                fontWeight="600"
                border="none"
                height={'3.5rem'}
                bg="gray.searchBoxGray"
                type="text"
                placeholder="Search meal plans!"
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
            </InputGroup>
            <FormErrorMessage color={'red'}>
              {errors.searchTerm && `${errors?.searchTerm.message}`}
            </FormErrorMessage>
          </form>
        </FormControl>
      </Box>
      <Box width={showMobileView ? '100%' : '50%'}>
        <Select
          placeholder="Sort by"
          cursor="pointer"
          _hover={{
            bg: 'brand.100',
            color: 'black',
          }}
          width={showMobileView ? '100%' : '6.5rem'}
          maxW={showMobileView ? '' : '12rem'}
          mt={showMobileView ? '1rem' : ''}
          icon={<SlArrowDown fontSize="1.3rem" />}
          fontSize="sm"
          fontWeight="600"
          borderColor="gray.lighterGray"
          bg="rgba(228, 228, 228, 0.3)"
          color="gray.bone"
          {...register(`sortBy`)}
          onChange={(e) => {
            handleSortChange(e.target.value);
          }}
          height={'3.5rem'}
        >
          <option value="relevance">Relevance</option>
          <option value="newest">Newest</option>
        </Select>
      </Box>
    </Box>
  );
});

SearchField.displayName = 'SearchField';

export default SearchField;
