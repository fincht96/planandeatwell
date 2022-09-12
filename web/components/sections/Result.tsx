import { Text, Stack, Container, Grid, GridItem, Box } from "@chakra-ui/react";
import Image from "next/image";

import SignupForm from "../SignupForm";

const Result = () => {
  return (
    <Container maxW="1200px" my={20}>
      <Text fontSize="24px" color="gray.dark" fontWeight={500} sx={{ mb: 5 }}>
        Get a list of tasty and nutrious meals with no food waste
      </Text>

      <Text fontSize="16px" color="gray.normal" fontWeight={400} mb={20}>
        That&apos;s it! You&apos;ll be presented with a priced list of recipes
        and all the necessary ingredients from your chosen supermarket.
      </Text>

      <Box display={"flex"} justifyContent={"center"} mb={20}>
        <Image
          priority
          src="/images/casserole-dish.png"
          width={700}
          height={467}
          alt={"people"}
        />
      </Box>

      <Text fontSize="24px" color="gray.dark" fontWeight={500} sx={{ mb: 5 }}>
        Like what you hear?
      </Text>

      <SignupForm />
    </Container>
  );
};

export default Result;
