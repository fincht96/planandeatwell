import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import SearchField from '../shared/SearchField';

const SearchMenu = (props: {
  showMobileView: boolean;
  onSearch: () => void;
  onSortByChange: () => void;
  sortBy: string;
  searchTerm: string;
  rest: any;
}) => {
  const {
    showMobileView,
    onSearch,
    onSortByChange,
    sortBy,
    searchTerm,
    ...rest
  } = props;

  const { register, reset, setValue, getValues } = useForm();

  useEffect(() => {
    if (getValues('sortBy') !== sortBy) {
      setValue('sortBy', sortBy);
    }
  }, [reset, sortBy, searchTerm, getValues, setValue]);

  return (
    <Box {...rest}>
      <SearchField
        showMobileView={showMobileView}
        handleSortChange={onSortByChange}
        value={searchTerm}
        onSearchSubmit={onSearch}
      />
    </Box>
  );
};

export default SearchMenu;
