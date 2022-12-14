import { Box, Button, FormLabel, Input } from '@chakra-ui/react';
import React from 'react';

const FilterCheckBox = React.forwardRef<any>((props: any, ref: any) => {
  const { label, id, isChecked, ...rest } = props;

  return (
    <Box>
      <Input type="checkbox" id={id} {...rest} hidden ref={ref} />
      <Button
        fontSize={'0.9rem'}
        border={'solid 1px'}
        borderColor={'brand.500'}
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
                color: 'brand.500',
                background: 'white',
              }
        }
        as={FormLabel}
        htmlFor={id}
      >
        {label}
      </Button>
    </Box>
  );
});

FilterCheckBox.displayName = 'FilterCheckBox';

export default FilterCheckBox;
