import { Stack, Text, Link } from "@chakra-ui/react";
import { ChevronUpIcon } from "@chakra-ui/icons";

const NavUp = (props: any) => {
  return (
    <Link
      href="#"
      color="gray.normal"
      _hover={{
        textDecoration: "none",
        color: "brand.500",
      }}
    >
      <Stack direction={"row"} alignItems={"center"} {...props}>
        <ChevronUpIcon w={65} h={65} color="inherit" />
        <Text fontSize="24px" color="inherit" fontWeight={400}>
          Back to top
        </Text>
      </Stack>
    </Link>
  );
};

export default NavUp;
