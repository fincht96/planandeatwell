import styles from '../../styles/Hero.module.css';
import Image from 'next/image';
import {
  Text,
  SimpleGrid,
  Box,
  Stack,
  Container,
  // Button,
  Flex,
  // Link,
} from '@chakra-ui/react';
import SignupForm from '../SignUpForm';
import { useEffect, useState, useMemo } from 'react';
// import NavDown from '../NavDown';

const DesktopHero = ({
  keyword,
  show,
  campaignId,
}: {
  keyword: string;
  show: boolean;
  campaignId: number;
}) => {
  return (
    <Stack spacing={8}>
      {campaignId === 0 && (
        <SimpleGrid columns={2} spacing={10}>
          <Box
            w="100%"
            display={'flex'}
            flexDirection="column"
            justifyContent={'space-between'}
          >
            <Stack spacing={5} my="auto">
              <Stack direction={'column'} spacing={1} mb={'2rem'}>
                <Text
                  fontSize={{ base: '1rem', md: '2.5rem', xl: '3rem' }}
                  color="black"
                  fontWeight={800}
                >
                  Not sure what to cook?
                </Text>

                <Stack direction={'row'}>
                  <Text
                    fontSize={{ base: '1rem', md: '2.5rem', xl: '3rem' }}
                    color="black"
                    fontWeight={800}
                  >
                    We save you&nbsp;
                  </Text>

                  <Box
                    display="inline-block"
                    borderBottom="solid black 2px"
                    width="170px"
                    marginBottom="0px"
                  >
                    {' '}
                    <Text
                      fontSize={{ base: '1rem', md: '2.5rem', xl: '3rem' }}
                      color="brand.500"
                      fontWeight={500}
                      className={show ? styles.typedOut : ''}
                      visibility={show ? 'visible' : 'hidden'}
                      textAlign="center"
                    >
                      {keyword}
                    </Text>
                  </Box>
                </Stack>
              </Stack>
              <Stack>
                <Text
                  fontSize="1.2rem"
                  color="gray.dark"
                  fontWeight={400}
                  w={{ base: '18rem', sm: '31rem' }}
                  mb={'2rem'}
                >
                  Create meal plans using our amazing recipes today by getting
                  early access.
                </Text>
                <Box w={{ base: '18rem', sm: '31rem' }}>
                  <SignupForm campaignId={campaignId} />
                </Box>
              </Stack>
              <Stack direction={'row'}>
                {/* <Button
                colorScheme="brand"
                fontSize="md"
                fontWeight="600"
                as={Link}
                href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}/sign-up`}
              >
                Join for free now
              </Button> */}
              </Stack>
            </Stack>
          </Box>
          <Box>
            <Image
              priority
              src="/images/cooking-pan.png"
              height={663}
              width={663}
              alt={'cooking pan'}
            />
          </Box>
        </SimpleGrid>
      )}
      {campaignId === 1 && (
        <SimpleGrid columns={2} spacing={10}>
          <Box
            w="100%"
            display={'flex'}
            flexDirection="column"
            justifyContent={'space-between'}
          >
            <Stack spacing={5} my="auto">
              <Stack direction={'column'} spacing={1} mb={'1rem'}>
                <Text
                  fontSize={{ base: '1.2rem', xl: '1.45rem' }}
                  color="black"
                  fontWeight={800}
                >
                  The ultimate platform for food content creators.
                </Text>

                <Stack direction={'row'}>
                  <Box
                    display="inline-block"
                    borderBottom="solid black 2px"
                    width="110px"
                    marginBottom="0px"
                  >
                    {' '}
                    <Text
                      fontSize={{ base: '1.2rem', xl: '1.45rem' }}
                      color="brand.500"
                      fontWeight={500}
                      className={show ? styles.typedOut : ''}
                      visibility={show ? 'visible' : 'hidden'}
                      textAlign="center"
                    >
                      {keyword}
                    </Text>
                  </Box>
                  <Text
                    fontSize={{ base: '1.2rem', xl: '1.45rem' }}
                    color="black"
                    fontWeight={800}
                  >
                    your food content.
                  </Text>
                </Stack>
              </Stack>
              <Stack>
                <Text
                  fontSize="1rem"
                  color="gray.dark"
                  fontWeight={400}
                  w={{ base: '18rem', sm: '31rem' }}
                  mb={'1rem'}
                >
                  We take your food content to the next level by making it easy
                  to create, share, and sell your recipes, meal plans, and
                  merchandise.
                </Text>
                <Box w={{ base: '18rem', sm: '31rem' }}>
                  <SignupForm campaignId={campaignId} />
                </Box>
              </Stack>
              <Stack direction={'row'}>
                {/* <Button
                colorScheme="brand"
                fontSize="md"
                fontWeight="600"
                as={Link}
                href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}/sign-up`}
              >
                Join for free now
              </Button> */}
              </Stack>
            </Stack>
          </Box>
          <Box boxShadow="15px -12px 0px 0px #39C698">
            <Image
              priority
              src="/images/influencer2.jpg"
              height={400}
              width={600}
              alt={'cooking pan'}
            />
          </Box>
        </SimpleGrid>
      )}

      {/* <Box display="flex" justifyContent={'center'}>
        <NavDown link={'#video'} color="black" />
      </Box> */}
    </Stack>
  );
};

const MobileHero = ({
  keyword,
  show,
  campaignId,
}: {
  keyword: string;
  show: boolean;
  campaignId: number;
}) => {
  return (
    <Stack spacing={{ base: 3, sm: 10 }}>
      {campaignId === 0 && (
        <SimpleGrid columns={1} spacing={0}>
          <Flex justifyContent="center" mt={{ base: '5rem', md: '1rem' }}>
            <Image
              priority
              src="/images/cooking-pan.png"
              height={250}
              width={250}
              alt={'cooking pan'}
            />
          </Flex>
          <Box w="100%" display={'flex'} flexDirection="column">
            <Stack spacing={8}>
              <Stack direction={'column'} alignItems={'center'}>
                <Stack direction={'row'}>
                  <Text
                    fontSize={{ base: '1.5rem', sm: '2.1rem' }}
                    color="black"
                    fontWeight={800}
                    textAlign="center"
                  >
                    Not sure what to cook?
                  </Text>
                </Stack>

                <Stack direction={'row'}>
                  <Text
                    fontSize={{ base: '1.5rem', sm: '2.1rem' }}
                    color="black"
                    fontWeight={800}
                  >
                    We save you&nbsp;
                  </Text>

                  <Box
                    display="inline-block"
                    borderBottom="solid black 2px"
                    width="100px"
                    marginBottom="0px"
                  >
                    <Text
                      fontSize={{ base: '1.5rem', sm: '1.8rem' }}
                      color="brand.500"
                      fontWeight={500}
                      className={show ? styles.typedOut : ''}
                      visibility={show ? 'visible' : 'hidden'}
                      textAlign="center"
                    >
                      {keyword}
                    </Text>
                  </Box>
                </Stack>
              </Stack>

              <Stack direction={'column'} alignItems="center">
                <Text
                  fontSize="1rem"
                  color="gray.dark"
                  fontWeight={400}
                  textAlign="left"
                  w={{ base: '18rem', sm: '26rem' }}
                  mb={'2rem'}
                >
                  Create meal plans using our amazing recipes today by getting
                  early access.
                </Text>
                <Box w={{ base: '18rem', sm: '26rem' }}>
                  <SignupForm campaignId={campaignId} />
                </Box>
              </Stack>

              <Stack direction={'row'} justifyContent="center">
                {/* <Button
                colorScheme="brand"
                fontSize="md"
                fontWeight="600"
                as={Link}
                href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}/sign-up`}
              >
                Join for free now
              </Button> */}
              </Stack>
            </Stack>
          </Box>
        </SimpleGrid>
      )}
      {campaignId === 1 && (
        // campaign social media influencer
        <SimpleGrid columns={1} spacing={0}>
          <Flex
            justifyContent="center"
            mt={{ base: '6rem', md: '1rem' }}
            mb={{ base: '2rem', md: '0.5rem' }}
          >
            <Box boxShadow="15px -12px 0px 0px #39C698">
              <Image
                priority
                src="/images/influencer2.jpg"
                height={280}
                width={280}
                alt={'cooking pan'}
              />
            </Box>
          </Flex>
          <Box w="100%" display={'flex'} flexDirection="column">
            <Stack spacing={8}>
              <Stack direction={'column'} alignItems={'center'}>
                <Stack direction={'row'}>
                  <Text
                    w={{ base: '18rem', sm: '26rem' }}
                    fontSize={{ base: '1.1rem', sm: '1.2rem' }}
                    color="black"
                    fontWeight={800}
                    textAlign="center"
                  >
                    The ultimate platform for food content creators.
                  </Text>
                </Stack>

                <Stack direction={'row'}>
                  <Box
                    display="inline-block"
                    borderBottom="solid black 2px"
                    width="100px"
                    marginBottom="0px"
                  >
                    <Text
                      fontSize={{ base: '1.1rem', sm: '1.2rem' }}
                      color="brand.500"
                      fontWeight={500}
                      className={show ? styles.typedOut : ''}
                      visibility={show ? 'visible' : 'hidden'}
                      textAlign="center"
                    >
                      {keyword}
                    </Text>
                  </Box>
                  <Text
                    fontSize={{ base: '1.1rem', sm: '1.2rem' }}
                    color="black"
                    fontWeight={800}
                  >
                    Your food content
                  </Text>
                </Stack>
              </Stack>

              <Stack direction={'column'} alignItems="center">
                <Text
                  fontSize="1rem"
                  color="gray.dark"
                  fontWeight={400}
                  textAlign="center"
                  w={{ base: '18rem', sm: '26rem' }}
                  mb={'2rem'}
                >
                  We take your food content to the next level by making it easy
                  to create, share, and sell your recipes, meal plans, and
                  merchandise.
                </Text>
                <Box w={{ base: '18rem', sm: '26rem' }}>
                  <SignupForm campaignId={campaignId} />
                </Box>
              </Stack>

              <Stack direction={'row'} justifyContent="center">
                {/* <Button
                colorScheme="brand"
                fontSize="md"
                fontWeight="600"
                as={Link}
                href={`${process.env.NEXT_PUBLIC_APP_BASE_URL}/sign-up`}
              >
                Join for free now
              </Button> */}
              </Stack>
            </Stack>
          </Box>
        </SimpleGrid>
      )}

      {/* <Box display="flex" justifyContent={'center'}>
        <NavDown link={'#video'} color="black" />
      </Box> */}
    </Stack>
  );
};

const Hero = ({ campaignId }: { campaignId: number }) => {
  const [show, setShow] = useState(true);
  const words = useMemo(() => {
    if (campaignId === 0) {
      return ['time', 'money', 'effort'];
    }
    if (campaignId === 1) {
      return ['Create', 'Share', 'Sell'];
    }
  }, [campaignId]);
  const [keyword, setKeyword] = useState(words[0]);

  useEffect(() => {
    setShow((current) => !current);
  }, [keyword]);

  useEffect(() => {
    let index = 0;
    const ref = setInterval(() => {
      if (index + 1 === words.length) {
        index = 0;
      } else {
        index++;
      }
      setKeyword(words[index]);
    }, 2000);

    return () => {
      clearInterval(ref);
    };
  }, [words, words.length]);

  return (
    <Box backgroundColor="gray.lighterGray" pt={{ base: '0px', md: '120px' }}>
      <Container maxW="1200px" mb={10} p={[0, 5]}>
        <Box display={{ base: 'none', lg: 'block' }}>
          <DesktopHero keyword={keyword} show={show} campaignId={campaignId} />
        </Box>

        <Box display={{ base: 'block', lg: 'none' }}>
          <MobileHero keyword={keyword} show={show} campaignId={campaignId} />
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
