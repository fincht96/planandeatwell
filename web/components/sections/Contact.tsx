import { Text, Box, Stack, Container } from "@chakra-ui/react";

const Contact = () => {
  return (
    <Box
      backgroundColor={"#FCFCFC"}
      borderBottom={1}
      borderTop={1}
      borderStyle={"solid"}
      borderColor={"gray.200"}
      sx={{ position: "relative" }}
    >
      <span id="contact" style={{ position: "absolute", top: "-100px" }} />
      <Container maxW="1200px" my={20}>
        <Stack spacing={5}>
          <Text
            fontSize="24px"
            color="gray.dark"
            fontWeight={500}
            sx={{ mb: 5 }}
          >
            Any questions?
          </Text>

          <Text fontSize="16px" color="gray.normal" fontWeight={400}>
            If you have any questions email us at&nbsp;
            <Text as="span" fontWeight={500}>
              support@planandeatwell.uk
            </Text>
            &nbsp;or drop us a message on Instagram
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default Contact;
