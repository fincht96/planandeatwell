import { Box } from '@chakra-ui/react';

const BorderBox = (props: any) => {
  return (
    <Box borderWidth={'1px'} borderRadius={'lg'} {...props}>
      {props.children}
    </Box>
  );
};

export default BorderBox;
