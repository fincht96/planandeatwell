import { Box, Flex, Select } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import SearchField from '../shared/SearchField';

const SearchMenu = (props) => {
  const { onSearch, onSortByChange, sortBy, searchTerm, ...rest } = props;

  const { register, reset, setValue, getValues } = useForm();

  useEffect(() => {
    if (getValues('sortBy') !== sortBy) {
      setValue('sortBy', sortBy);
    }
  }, [reset, sortBy, searchTerm, getValues, setValue]);

  return (
    <Box {...rest}>
      <SearchField value={searchTerm} onSearchSubmit={onSearch} mb={'2rem'} />
      <Flex
        mb={'2rem'}
        gap={'1rem'}
        justifyContent={'flex-end'}
        alignItems={'center'}
      >
        <Select
          maxW={'12rem'}
          bg={'white'}
          {...register(`sortBy`)}
          onChange={(e) => {
            onSortByChange(e.target.value);
          }}
          height={'2rem'}
          color={'gray.dark'}
        >
          <option value="relevance">Relevance</option>
          <option value="newest">Newest</option>
        </Select>
      </Flex>
    </Box>
  );
};

export default SearchMenu;
