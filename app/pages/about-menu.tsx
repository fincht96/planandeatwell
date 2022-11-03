import { Box, Button, Container, Flex, Icon, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BiRecycle } from 'react-icons/bi';
import { CgBowl } from 'react-icons/cg';
import { FcTodoList } from 'react-icons/fc';
import { TbLeaf } from 'react-icons/tb';
import Layout, { siteTitle } from '../components/layout';
import aboutMenuImg from '../public/images/about-menu.png';
import styles from '../styles/About.module.css';

const AboutMenu: NextPage = () => {
  const router = useRouter();

  const onNavigate = (pathname: string, query: any) => {
    router.push({ pathname, query });
  };

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <Container mt={'5rem'} maxW={'60rem'}>
        <Flex justifyContent={'center'}>
          <Box
            maxW={'450px'}
            mr={'3rem'}
            display={{ base: 'none', md: 'block' }}
          >
            <Image quality={100} src={aboutMenuImg} />
          </Box>

          <Box>
            <Text
              fontSize={{ base: '1.25rem', md: '1.5rem' }}
              color="gray.dark"
              fontWeight={600}
              mt={'5rem'}
              mb={'1rem'}
            >
              Your culinary adventure waits...
            </Text>

            <Box>
              <Flex alignItems={'center'} mb={'1rem'}>
                <Icon
                  as={CgBowl}
                  width={{ base: '2rem' }}
                  height={{ base: '2rem' }}
                  color={'#4d4d4d'}
                />
                <Text
                  ml={'1rem'}
                  fontSize={'1.2rem'}
                  color="gray.dark"
                  fontWeight={400}
                >
                  Over 25 tasty recipes on any budget
                </Text>
              </Flex>

              <Flex alignItems={'center'} mb={'1rem'}>
                <Icon
                  as={TbLeaf}
                  width={{ base: '2rem' }}
                  height={{ base: '2rem' }}
                  color={'#4d4d4d'}
                />
                <Text
                  ml={'1rem'}
                  fontSize={'1.2rem'}
                  color="gray.dark"
                  fontWeight={400}
                >
                  Recipes for every appetite and dietary need
                </Text>
              </Flex>

              <Flex alignItems={'center'} mb={'1rem'}>
                <Icon
                  as={BiRecycle}
                  width={{ base: '2rem' }}
                  height={{ base: '2rem' }}
                  color={'#4d4d4d'}
                />
                <Text
                  ml={'1rem'}
                  fontSize={'1.2rem'}
                  color="gray.dark"
                  fontWeight={400}
                >
                  Minimize food waste and save money
                </Text>
              </Flex>

              <Flex alignItems={'center'} mb={'1rem'}>
                <Icon
                  as={FcTodoList}
                  width={{ base: '2rem' }}
                  height={{ base: '2rem' }}
                  className={styles.icon}
                />
                <Text
                  ml={'1rem'}
                  fontSize={'1.2rem'}
                  color="gray.dark"
                  fontWeight={400}
                >
                  Save the hassle planning
                </Text>
              </Flex>
            </Box>

            <Flex justifyContent={'center'}>
              <Button
                mt={4}
                colorScheme="brand"
                w={'100%'}
                fontSize={{ base: '1.1rem', md: '1.2rem' }}
                fontWeight={600}
                padding={'1.5rem 1rem'}
                onClick={() => onNavigate('/menu', router.query)}
              >
                See the menu
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
};

export default AboutMenu;
