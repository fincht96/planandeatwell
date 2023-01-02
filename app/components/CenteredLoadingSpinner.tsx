import { Spinner } from '@chakra-ui/react';

// Loading spinner centered on screen
const CenteredLoadingSpinner = () => {
  return (
    <>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="brand.500"
        size="xl"
        position="fixed"
        top="0"
        left="0"
        bottom="0"
        right="0"
        margin="auto"
      />
    </>
  );
};

export default CenteredLoadingSpinner;
