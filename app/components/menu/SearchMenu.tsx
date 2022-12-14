import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Select,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { IoOptions } from 'react-icons/io5';

import { useForm } from 'react-hook-form';
import {
  convertBoolObjToStringArray,
  convertStringArrayToBoolObj,
} from '../../utils/boolFilterConversions';
import {
  freeFromDefaults,
  lifestyleDefaults,
  mealDefaults,
} from '../../utils/filterDefaults';
import { toTitleCase } from '../../utils/toTitleCase';
import FilterCheckBox from './FilterCheckBox';
import SearchField from './SearchField';

const SearchMenu = (props) => {
  const {
    onSearch,
    onFiltersChange,
    onSortByChange,
    mealsFilters,
    lifestyleFilters,
    freeFromFilters,
    sortBy,
    searchTerm,
    ...rest
  } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  const filtersCount =
    mealsFilters.length + lifestyleFilters.length + freeFromFilters.length;

  const { register, handleSubmit, watch, reset, setValue, getValues } =
    useForm();

  const onFilterMenuSubmit = (data) => {
    onFiltersChange({
      meals: convertBoolObjToStringArray(data.meals),
      lifestyles: convertBoolObjToStringArray(data.lifestyles),
      freeFroms: convertBoolObjToStringArray(data.freeFroms),
      order: 'any',
      orderBy: 'relevance',
    });
    onClose();
  };

  const onClear = () => {
    reset({ ...mealDefaults, ...lifestyleDefaults, ...freeFromDefaults });
  };

  useEffect(() => {
    if (getValues('sortBy') !== sortBy) {
      setValue('sortBy', sortBy);
    }

    if (isOpen) {
      reset({
        meals: {
          ...mealDefaults.meals,
          ...convertStringArrayToBoolObj(mealsFilters),
        },
        lifestyles: {
          ...lifestyleDefaults.lifestyles,
          ...convertStringArrayToBoolObj(lifestyleFilters),
        },
        freeFroms: {
          ...freeFromDefaults.freeFroms,
          ...convertStringArrayToBoolObj(freeFromFilters),
        },
      });
    }
  }, [
    reset,
    isOpen,
    mealsFilters,
    lifestyleFilters,
    freeFromFilters,
    sortBy,
    searchTerm,
    getValues,
    setValue,
  ]);

  return (
    <Box {...rest}>
      <SearchField value={searchTerm} onSearchSubmit={onSearch} mb={'2rem'} />
      <Flex
        mb={'2rem'}
        gap={'1rem'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Button
          ref={btnRef}
          colorScheme="brand"
          onClick={onOpen}
          leftIcon={<IoOptions />}
          fontWeight={'normal'}
          height={'2rem'}
        >
          Filters ({filtersCount})
        </Button>

        <Flex gap={'1rem'} alignItems={'center'} boxSizing={'content-box'}>
          <Select
            minW={'12rem'}
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
            <option value="priceAscending">Price Ascending</option>
            <option value="priceDescending">Price Descending</option>
          </Select>
        </Flex>
      </Flex>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={() => {
          onClear();
          onClose();
        }}
        finalFocusRef={btnRef}
      >
        <form onSubmit={handleSubmit(onFilterMenuSubmit)} autoComplete="off">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Filters</DrawerHeader>

            <DrawerBody>
              <Box mb={'2rem'}>
                <Text>Meal type</Text>
                <Flex flexWrap={'wrap'}>
                  {Object.keys(mealDefaults.meals).map((meal: string) => {
                    return (
                      <FilterCheckBox
                        key={meal}
                        label={toTitleCase(meal)}
                        id={meal}
                        isChecked={watch(`meals.${meal}`)}
                        {...register(`meals.${meal}`)}
                      />
                    );
                  })}
                </Flex>
              </Box>

              <Box mb={'2rem'}>
                <Text>Lifestyle</Text>
                <Flex flexWrap={'wrap'}>
                  {Object.keys(lifestyleDefaults.lifestyles).map(
                    (lifestyle: string) => {
                      return (
                        <FilterCheckBox
                          key={lifestyle}
                          label={toTitleCase(lifestyle)}
                          id={lifestyle}
                          isChecked={watch(`lifestyles.${lifestyle}`)}
                          {...register(`lifestyles.${lifestyle}`)}
                        />
                      );
                    },
                  )}
                </Flex>
              </Box>

              <Box>
                <Text>Free from</Text>
                <Flex flexWrap={'wrap'}>
                  {Object.keys(freeFromDefaults.freeFroms).map(
                    (freeFrom: string) => {
                      return (
                        <FilterCheckBox
                          key={freeFrom}
                          label={toTitleCase(freeFrom)}
                          id={freeFrom}
                          isChecked={watch(`freeFroms.${freeFrom}`)}
                          {...register(`freeFroms.${freeFrom}`)}
                        />
                      );
                    },
                  )}
                </Flex>
              </Box>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClear}>
                Clear
              </Button>
              <Button colorScheme="brand" type="submit">
                Apply
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </Box>
  );
};

export default SearchMenu;
