import { Text, Box, Stack, Container, Link } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import NextLink from "next/link";

const Footer = () => {
  return (
    <Box sx={{ position: "relative" }}>
      <Container maxW="1200px" my={20}>
        <Stack spacing={5} alignItems={"center"}>
          <Text
            fontSize="24px"
            color="gray.dark"
            fontWeight={500}
            sx={{ mb: 5 }}
            textAlign={"center"}
          >
            Get updates
          </Text>

          <Box display={"flex"} justifyContent={"center"}>
            <Link
              href={"https://www.instagram.com/planandeatwell/"}
              target={"_blank"}
            >
              <Icon
                as={BsInstagram}
                width={{ xl: 12, base: 10 }}
                height={{ xl: 12, base: 10 }}
                color={"brand.500"}
              />
            </Link>
          </Box>

          <Box borderBottom={"solid 1px #CCCCCC"} w={"100px"}></Box>
        </Stack>
      </Container>
      <NextLink href="/privacy" passHref>
        <Link
          fontSize="16px"
          color="gray.light"
          fontWeight={500}
          display={"inline-block"}
          sx={{ mb: 5, width: "100%" }}
          textAlign={"center"}
        >
          Privacy policy
        </Link>
      </NextLink>
      <NextLink href="/terms-and-conditions" passHref>
        <Link
          fontSize="16px"
          color="gray.light"
          fontWeight={500}
          display={"inline-block"}
          sx={{ mb: 5, width: "100%" }}
          textAlign={"center"}
        >
          Terms and conditions
        </Link>
      </NextLink>

      <Text
        fontSize="16px"
        color="gray.light"
        fontWeight={500}
        sx={{ mb: 5 }}
        textAlign={"center"}
      >
        © 2022 Plan and Eat Well. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
