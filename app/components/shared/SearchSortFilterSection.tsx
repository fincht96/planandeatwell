import { Box, Flex } from '@chakra-ui/react';
import FilterRecipesButton from './FilterRecipesButton';
import SearchField from './SearchField';
import SelectComponent from './SelectComponent';

const SearchSortFilterSection = (props: any) => {
  const {
    onFiltersChange,
    freeFromFilters,
    mealsFilters,
    lifestyleFilters,
    searchFieldPlaceHolderText,
    selectValues,
    handleSortChange,
    onSearchSubmit,
    minLength = 2,
    maxLength = 200,
    sortBy,
    searchTerm,
    showRecipesFilter = false,
  } = props;

  // todo: add sensible defaults to below components to avoid explicitly setting props each time
  return (
    <Flex flexDirection={{ base: 'column', xl: 'row' }} mb="2rem">
      <Box display="flex" flexDirection="row">
        <SearchField
          searchFieldPlaceHolderText={searchFieldPlaceHolderText}
          onSearchSubmit={onSearchSubmit}
          minLength={minLength}
          maxLength={maxLength}
          searchTerm={searchTerm}
          searchFieldBgColor="gray.searchBoxGray"
          searchFieldBorder="none"
          searchFieldTextColor="black"
          searchFieldHeight="3.5rem"
          searchFieldParentWidth={{ base: '100%' }}
          searchFieldFontWeight="600"
          searchFieldFontSize="sm"
          searchFieldWidth={{ base: '100rem', xl: '21.7rem' }}
          searchFieldParentMargin="0 1.5rem 0 0"
        />
      </Box>
      <Box display="flex" flexDirection="row">
        <SelectComponent
          selectValues={selectValues}
          handleSortChange={handleSortChange}
          sortBy={sortBy}
          selectParentWith={{ base: '50%', xl: '100%' }}
          selectFontSize="md"
          selectHeight="3.5rem"
          selectBorderColor="gray.lighterGray"
          selectBgColor="rgba(228, 228, 228, 0.3)"
          selectTextColor="gray.bone"
          selectFontWeight="600"
          selectParentMargin="0 1.5rem 0 0"
          selectWidth="100%"
        />
        {showRecipesFilter && (
          <FilterRecipesButton
            onFiltersChange={onFiltersChange}
            mealsFilters={mealsFilters}
            lifestyleFilters={lifestyleFilters}
            freeFromFilters={freeFromFilters}
            btnHeight="3.5rem"
            btnBgColor="rgba(228, 228, 228, 0.3)"
            btnTextColor="gray.bone"
            btnFontWeight="600"
            btnFontSize="md"
            btnBorderColor="gray.lighterGray"
            btnParentWidth={{ base: '50%', xl: '100%' }}
            btnWidth="100%"
          />
        )}
      </Box>
    </Flex>
  );
};

SearchSortFilterSection.displayName = 'SearchSortFilterSection';

export default SearchSortFilterSection;
