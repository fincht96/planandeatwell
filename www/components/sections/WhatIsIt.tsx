import { Text, Stack, Container } from "@chakra-ui/react";

const WhatIsIt = () => {
  return (
    <Container maxW="1200px" my={20} sx={{ position: "relative" }}>
      <span id="what-is-it" style={{ position: "absolute", top: "-120px" }} />
      <Stack spacing={5}>
        <Text fontSize="24px" color="gray.dark" fontWeight={500} sx={{ mb: 5 }}>
          What is it?
        </Text>

        <Text fontSize="16px" color="gray.normal" fontWeight={400}>
          Plan and Eat Well is a free service that allows you to easily plan
          simple and healthy meals using ingredients at the supermarket on any
          budget with minimal effort.
        </Text>
      </Stack>
    </Container>
  );
};

export default WhatIsIt;
