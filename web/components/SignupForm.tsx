import { Text, Stack, Button, Input } from "@chakra-ui/react";

const SignupForm = () => {
  return (
    <Stack spacing={5}>
      <Text
        fontSize={{ base: "5vw", sm: "4vw", md: "20px" }}
        color="gray.normal"
        fontWeight={400}
      >
        Join the waiting list
      </Text>
      <Input
        placeholder="Email"
        fontSize={{ base: "5vw", sm: "4vw", md: "20px" }}
      />
      <Button
        colorScheme="brand"
        maxW="min-content"
        fontSize={{ base: "5vw", sm: "4vw", md: "20px" }}
        fontWeight={400}
        padding={"10px 25px"}
      >
        Sign up
      </Button>
    </Stack>
  );
};

export default SignupForm;
