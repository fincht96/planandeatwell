import { Text, Stack, Container, Center, Box } from '@chakra-ui/react';

const Video = () => {
  return (
    <Container
      maxW="1200px"
      my={10}
      sx={{ position: 'relative' }}
      py={{ base: 'none', sm: 5 }}
    >
      <span id="video" style={{ position: 'absolute', top: '-120px' }} />
      <Stack spacing={3} mb={3}>
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          color="brand.500"
          fontWeight={700}
          textAlign="center"
        >
          Watch a video
        </Text>
        <Text
          fontSize={{ base: '1.4rem', sm: '1.9rem', md: '2.25rem' }}
          color="black"
          fontWeight={800}
          textAlign="center"
        >
          Learn how to use our app
        </Text>
        <Text
          fontSize={{ base: '1rem', md: '1.2rem' }}
          color="gray.dark"
          fontWeight="400"
          textAlign="center"
          mx="auto"
        >
          The video below guides you through our app and the core features.
          Click on the video to watch on youtube.
        </Text>
      </Stack>
      <Stack>
        <Center>
          <Box
            allowFullScreen
            as="iframe"
            src="https://www.youtube.com/embed/b8_x92LX-Pc"
            width="100%"
            sx={{
              aspectRatio: '16/9',
            }}
          />
        </Center>
      </Stack>
    </Container>
  );
};

export default Video;
