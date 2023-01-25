import {
  Text,
  Stack,
  Container,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Flex,
  Link,
} from '@chakra-ui/react';

const FAQ = () => {
  return (
    <Container
      maxW="1200px"
      my={10}
      sx={{ position: 'relative' }}
      py={{ base: 'none', sm: 5 }}
    >
      <span id="faq" style={{ position: 'absolute', top: '-120px' }} />
      <Stack spacing={3} mb={7}>
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          color="brand.500"
          fontWeight={700}
          textAlign="center"
        >
          FAQ
        </Text>
        <Text
          fontSize={{ base: '1.4rem', sm: '1.9rem', md: '2.25rem' }}
          color="black"
          fontWeight={800}
          textAlign="center"
        >
          Frequently Asked Questions
        </Text>
        <Text
          fontSize={{ base: '1rem', md: '1.2rem' }}
          color="gray.dark"
          fontWeight="400"
          textAlign="center"
          mx="auto"
        >
          Below you can find some of the most commonly asked questions
        </Text>
      </Stack>
      <Flex justifyContent="center">
        <Accordion allowMultiple width="42rem">
          <AccordionItem borderBottom="none" borderTop="none">
            <h2>
              <AccordionButton
                height="4rem"
                border="solid"
                borderRadius="xl"
                mb="1.2rem"
                bg="gray.lightGray"
              >
                <Text
                  as="span"
                  flex="1"
                  textAlign="left"
                  fontSize="md"
                  fontWeight="600"
                >
                  How do I get in contact with you?
                </Text>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} pt={0}>
              <Text fontSize="md" color="gray.bone" fontWeight={400}>
                If you have any questions email us at&nbsp;
                <Link
                  fontWeight={500}
                  href="mailto:support@planandeatwell.uk"
                  isExternal
                >
                  support@planandeatwell.uk
                </Link>
                &nbsp;or drop us a message on Instagram
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem borderBottom="none" borderTop="none">
            <h2>
              <AccordionButton
                height="4rem"
                border="solid"
                borderRadius="xl"
                mb="1.2rem"
                bg="gray.lightGray"
              >
                <Text
                  as="span"
                  flex="1"
                  textAlign="left"
                  fontSize="md"
                  fontWeight="600"
                >
                  Is plan and eat well free?
                </Text>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} pt={0}>
              <Text fontSize="md" color="gray.bone" fontWeight={400}>
                Yes, our service is completely free to use.
              </Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem borderBottom="none" borderTop="none">
            <h2>
              <AccordionButton
                height="4rem"
                border="solid"
                borderRadius="xl"
                mb="1.2rem"
                bg="gray.lightGray"
              >
                <Text
                  as="span"
                  flex="1"
                  textAlign="left"
                  fontSize="md"
                  fontWeight="600"
                >
                  How many meal plans can I create?
                </Text>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} pt={0}>
              <Text fontSize="md" color="gray.bone" fontWeight={400}>
                You can create and share as many as you like :)
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </Container>
  );
};

export default FAQ;
