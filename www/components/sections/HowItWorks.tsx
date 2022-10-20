import { Text, Container, Grid, GridItem, Box } from "@chakra-ui/react";
import Image from "next/image";
import { useMediaQuery } from "@chakra-ui/react";

const MobileGrid = () => {
  return (
    <Grid templateColumns={"repeat(1, 1fr)"} rowGap={20}>
      <GridItem
        w="100%"
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
      >
        <Box mb={5}>
          <Text
            fontSize="18px"
            color="gray.dark"
            fontWeight={500}
            sx={{ mb: 2, textAlign: "left" }}
          >
            1. Choose your supermarket
          </Text>

          <Text fontSize="16px" color="gray.normal" fontWeight={400}>
            Choose the supermarket that best suits your needs.
          </Text>
        </Box>

        <Box display={"flex"} justifyContent={"center"}>
          <Image
            priority
            src="/images/shopping-trolley.png"
            height={200}
            width={200}
            alt={"shopping-trolley"}
          />
        </Box>
      </GridItem>

      <GridItem
        w="100%"
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
      >
        <Box mb={5}>
          <Text
            fontSize="18px"
            color="gray.dark"
            fontWeight={500}
            sx={{ mb: 2 }}
          >
            2. Choose the number of people
          </Text>

          <Text fontSize="16px" color="gray.normal" fontWeight={400}>
            Get the right quantity of ingredients for one or more people.
          </Text>
        </Box>

        <Box display={"flex"} justifyContent={"center"}>
          <Image
            priority
            src="/images/people.png"
            height={200}
            width={200}
            alt={"people"}
          />
        </Box>
      </GridItem>

      <GridItem
        w="100%"
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
      >
        <Box mb={5}>
          <Text
            fontSize="18px"
            color="gray.dark"
            fontWeight={500}
            sx={{ mb: 2 }}
          >
            3. Choose your meal preferences
          </Text>

          <Text fontSize="16px" color="gray.normal" fontWeight={400}>
            Choose the meal you want to create recipes for and specify any
            dietary preferences. You can also specify any ingredients you
            already have.
          </Text>
        </Box>

        <Box display={"flex"} justifyContent={"center"}>
          <Image
            priority
            src="/images/rice-bowl.png"
            height={200}
            width={200}
            alt={"rice-bowl"}
          />
        </Box>
      </GridItem>

      <GridItem
        w="100%"
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
      >
        <Box mb={5}>
          <Text
            fontSize="18px"
            color="gray.dark"
            fontWeight={500}
            sx={{ mb: 2 }}
          >
            4. Choose your budget
          </Text>

          <Text fontSize="16px" color="gray.normal" fontWeight={400}>
            You never need to overspend, know exactly how much it will cost
            before you go.
          </Text>
        </Box>

        <Box display={"flex"} justifyContent={"center"}>
          <Image
            priority
            src="/images/card.png"
            height={200}
            width={200}
            alt={"bank-card"}
          />
        </Box>
      </GridItem>
    </Grid>
  );
};

const DesktopGrid = () => {
  return (
    <Grid templateColumns={"repeat(2, 1fr)"} rowGap={20}>
      <GridItem w="100%" display={"flex"} justifyContent={"center"}>
        <Image
          priority
          src="/images/shopping-trolley.png"
          height={250}
          width={250}
          alt={"shopping-trolley"}
        />
      </GridItem>

      <GridItem
        w="100%"
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
      >
        <>
          <Text
            fontSize="18px"
            color="gray.dark"
            fontWeight={500}
            sx={{ mb: 5 }}
          >
            1. Choose your supermarket
          </Text>

          <Text fontSize="16px" color="gray.normal" fontWeight={400}>
            Choose the supermarket that best suits your needs.
          </Text>
        </>
      </GridItem>

      <GridItem
        w="100%"
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
      >
        <>
          <Text
            fontSize="18px"
            color="gray.dark"
            fontWeight={500}
            sx={{ mb: 5 }}
          >
            2. Choose the number of people
          </Text>

          <Text fontSize="16px" color="gray.normal" fontWeight={400}>
            Get the right quantity of ingredients for one or more people.
          </Text>
        </>
      </GridItem>

      <GridItem w="100%" display={"flex"} justifyContent={"center"}>
        <Image
          priority
          src="/images/people.png"
          height={250}
          width={250}
          alt={"people"}
        />
      </GridItem>

      <GridItem w="100%" display={"flex"} justifyContent={"center"}>
        <Image
          priority
          src="/images/rice-bowl.png"
          height={250}
          width={250}
          alt={"rice bowl"}
        />
      </GridItem>

      <GridItem
        w="100%"
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
      >
        <>
          <Text
            fontSize="18px"
            color="gray.dark"
            fontWeight={500}
            sx={{ mb: 5 }}
          >
            3. Choose your meal preferences
          </Text>

          <Text fontSize="16px" color="gray.normal" fontWeight={400}>
            Choose the meal you want to create recipes for and specify any
            dietary preferences. You can also specify any ingredients you
            already have.
          </Text>
        </>
      </GridItem>

      <GridItem
        w="100%"
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
      >
        <>
          <Text
            fontSize="18px"
            color="gray.dark"
            fontWeight={500}
            sx={{ mb: 5 }}
          >
            4. Choose your budget
          </Text>

          <Text fontSize="16px" color="gray.normal" fontWeight={400}>
            You never need to overspend, know exactly how much it will cost
            before you go.
          </Text>
        </>
      </GridItem>

      <GridItem w="100%" display={"flex"} justifyContent={"center"}>
        <Image
          priority
          src="/images/card.png"
          height={250}
          width={250}
          alt={"bank-card"}
        />
      </GridItem>
    </Grid>
  );
};

const HowItWorks = () => {
  const [isLessThan670px] = useMediaQuery("(max-width: 670px)");

  return (
    <Container maxW="1200px" my={20} sx={{ position: "relative" }}>
      <span id="how-it-works" style={{ position: "absolute", top: "-120px" }} />
      <Text fontSize="24px" color="gray.dark" fontWeight={500} sx={{ mb: 5 }}>
        How it works
      </Text>

      <Container
        // centerContent
        maxW={isLessThan670px ? "1200px" : "1100px"}
        padding={0}
        mt={10}
      >
        {isLessThan670px ? <MobileGrid /> : <DesktopGrid />}
      </Container>
    </Container>
  );
};

export default HowItWorks;
