import { Box, Select } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SlArrowDown } from 'react-icons/sl';

const SelectComponent = (props: any) => {
  const {
    selectValues,
    handleSortChange,
    sortBy,
    selectParentWith,
    selectFontSize,
    selectBorderColor,
    selectTextColor,
    selectFontWeight,
    selectBgColor,
    selectHeight,
    selectParentMargin,
    selectWidth,
  } = props;

  const { register, getValues, setValue } = useForm();

  useEffect(() => {
    if (getValues('sortBy') !== sortBy) {
      setValue('sortBy', sortBy);
    }
  }, [sortBy, getValues, setValue]);

  return (
    <Box width={selectParentWith} m={selectParentMargin}>
      <Select
        cursor="pointer"
        _hover={{
          bg: 'brand.100',
          color: 'black',
        }}
        width={selectWidth}
        icon={<SlArrowDown fontSize="1rem" color="black" />}
        fontSize={selectFontSize}
        fontWeight={selectFontWeight}
        borderColor={selectBorderColor}
        bg={selectBgColor}
        color={selectTextColor}
        {...register(`sortBy`)}
        onChange={(e) => {
          handleSortChange(e.target.value);
        }}
        height={selectHeight}
      >
        {Object.entries(selectValues).map(([key, value]: any, index) => {
          return (
            <option key={index} value={key}>
              {value}
            </option>
          );
        })}
      </Select>
    </Box>
  );
};

export default SelectComponent;
