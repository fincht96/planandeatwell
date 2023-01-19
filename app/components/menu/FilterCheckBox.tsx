import { Button, FormLabel, Input } from '@chakra-ui/react';
import React from 'react';

const FilterCheckBox = React.forwardRef<any>((props: any, ref: any) => {
  const { label, id, isChecked, ...rest } = props;

  return (
    <>
      <Input type="checkbox" id={id} {...rest} hidden ref={ref} />
      <Button
        borderRadius="lg"
        fontSize="sm"
        cursor={'pointer'}
        sx={
          isChecked
            ? {
                color: 'white',
                background: 'brand.500',
                fontWeight: 600,
                ':hover': {
                  background: 'brand.500',
                },
              }
            : {
                color: 'gray.bone',
                background: 'gray.veryLightGray',
                ':hover': {
                  background: 'brand.100',
                },
              }
        }
        as={FormLabel}
        htmlFor={id}
      >
        {label}
      </Button>
    </>
  );
});

FilterCheckBox.displayName = 'FilterCheckBox';

export default FilterCheckBox;
