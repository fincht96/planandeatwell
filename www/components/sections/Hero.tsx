import styles from '../../styles/Hero.module.css';
import Image from 'next/image';
import { Text, SimpleGrid, Box, Stack, Container } from '@chakra-ui/react';

import { useEffect, useState, useMemo } from 'react';
import NavDown from '../NavDown';

const DesktopHero = ({ keyword, show }: { keyword: string; show: boolean }) => {
  return (
    <Stack spacing={8}>
      <SimpleGrid columns={2} spacing={10}>
        <Box
          w="100%"
          display={'flex'}
          flexDirection="column"
          justifyContent={'space-between'}
        >
          <Stack spacing={5} py={'130px'}>
            <Stack direction={'column'} spacing={2}>
              <Text fontSize="50px" color="gray.dark" fontWeight={500}>
                Not sure what to cook?
              </Text>

              <Stack direction={'row'}>
                <Text fontSize="50px" color="gray.dark" fontWeight={500}>
                  We save you&nbsp;
                </Text>

                <span className={styles.container}>
                  <Text
                    fontSize="50px"
                    color="gray.dark"
                    fontWeight={300}
                    className={show ? styles.typedOut : ''}
                    visibility={show ? 'visible' : 'hidden'}
                  >
                    {keyword}
                  </Text>
                </span>
              </Stack>
            </Stack>

            <Text fontSize="20px" color="gray.normal" fontWeight={400}>
              A free tool for creating budgeted meal plans from your local
              supermarket with meals starting from less than £0.99/pp
            </Text>
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

      <Box display="flex" justifyContent={'center'}>
        <NavDown link={'#what-is-it'} color={'gray.light'} />
      </Box>
    </Stack>
  );
};

const MobileHero = ({ keyword, show }: { keyword: string; show: boolean }) => {
  return (
    <Stack spacing={8}>
      <SimpleGrid columns={1} spacing={10}>
        <Box
          w="100%"
          display={'flex'}
          flexDirection="column"
          justifyContent={'space-between'}
        >
          <Stack spacing={50}>
            <Stack direction={'column'} spacing={2} alignItems={'center'}>
              <Text fontSize="6vw" color="gray.dark" fontWeight={500}>
                Not sure what to cook?
              </Text>

              <Stack direction={'row'}>
                <Text fontSize="6vw" color="gray.dark" fontWeight={500} sx={{}}>
                  We save you&nbsp;
                </Text>

                <span className={styles.container}>
                  <Text
                    fontSize="6vw"
                    color="gray.dark"
                    fontWeight={300}
                    className={show ? styles.typedOut : ''}
                    visibility={show ? 'visible' : 'hidden'}
                  >
                    {keyword}
                  </Text>
                </span>
              </Stack>
            </Stack>

            <Text fontSize={{ md: '3vw' }} color="gray.normal" fontWeight={400}>
              A free tool for creating budgeted meal plans from your local
              supermarket with meals starting from less than £0.99/pp
            </Text>
          </Stack>
        </Box>
      </SimpleGrid>

      <Box display="flex" justifyContent={'center'}>
        <NavDown link={'#what-is-it'} color={'gray.light'} />
      </Box>
    </Stack>
  );
};

const Hero = () => {
  const [show, setShow] = useState(true);
  const words = useMemo(() => ['time', 'money', 'effort'], []);
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
    <Box
      backgroundColor={'#FCFCFC'}
      pt={'100px'}
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={'gray.200'}
    >
      <Container maxW="1200px" mb={10}>
        <Box display={{ base: 'none', lg: 'block' }}>
          <DesktopHero keyword={keyword} show={show} />
        </Box>

        <Box display={{ base: 'block', lg: 'none' }}>
          <MobileHero keyword={keyword} show={show} />
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
