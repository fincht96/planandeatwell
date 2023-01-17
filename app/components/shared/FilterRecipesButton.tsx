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
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { SlEqualizer } from 'react-icons/sl';
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
import FilterCheckBox from '../menu/FilterCheckBox';

const FilterRecipesButton = (props: any) => {
  const {
    onFiltersChange,
    mealsFilters,
    lifestyleFilters,
    freeFromFilters,
    btnHeight,
    btnBgColor,
    btnTextColor,
    btnBorderColor,
    btnFontWeight,
    btnFontSize,
    btnParentWidth,
    btnWidth,
  } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  const filtersCount =
    mealsFilters.length + lifestyleFilters.length + freeFromFilters.length;

  const { register, handleSubmit, watch, reset, setValue, getValues } =
    useForm();

  const onFilterMenuSubmit = (data: any) => {
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
    getValues,
    setValue,
  ]);

  return (
    <Box width={btnParentWidth}>
      <Button
        width={btnWidth}
        cursor="pointer"
        _hover={{
          bg: 'brand.100',
          color: 'black',
        }}
        fontSize={btnFontSize}
        fontWeight={btnFontWeight}
        borderColor={btnBorderColor}
        color={btnTextColor}
        bg={btnBgColor}
        height={btnHeight}
        ref={btnRef}
        onClick={onOpen}
        rightIcon={<SlEqualizer fontSize="1rem" color="black" />}
      >
        Filters ({filtersCount})
      </Button>

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
          <DrawerContent bg="gray.lighterGray">
            <DrawerCloseButton />
            <DrawerHeader>
              <Text fontSize="2xl" fontWeight="600">
                Filters
              </Text>
            </DrawerHeader>
            <DrawerBody>
              <Box mb={'2rem'}>
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.dark"
                  mb="0.5rem"
                >
                  Meal types
                </Text>
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
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.dark"
                  mb="0.5rem"
                >
                  Lifestyle types
                </Text>
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
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.dark"
                  mb="0.5rem"
                >
                  Free from types
                </Text>
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
              <Button
                borderRadius="lg"
                border="solid"
                borderColor="gray.light"
                bg="white"
                color="gray.dark"
                _hover={{ bg: 'brand.100', color: 'gray.dark' }}
                mr={3}
                onClick={onClear}
              >
                Clear
              </Button>
              <Button
                borderRadius="lg"
                bg="brand.500"
                color="white"
                _hover={{ bg: 'brand.100', color: 'black' }}
                type="submit"
              >
                Apply
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </Box>
  );
};

export default FilterRecipesButton;
