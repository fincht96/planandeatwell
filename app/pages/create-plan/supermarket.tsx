import { Box, Grid, Text } from '@chakra-ui/react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout, { siteTitle } from '../../components/layout';
import StepLayout from '../../components/StepLayout';
import aldiImg from '../../public/images/aldi.png';
import asdaImg from '../../public/images/asda.png';
import sainsburysImg from '../../public/images/sainsburys.png';
import tescoImg from '../../public/images/tesco.png';
import { CustomNextPage } from '../../types/CustomNextPage';

const SupermarketButton = ({
  disabled = false,
  supermarket,
  imageProp,
  onClick,
}: {
  disabled: boolean;
  supermarket: string;
  imageProp: any;
  onClick: any;
}) => {
  return (
    <Box
      bg={'#ffffff'}
      border={'solid 1px #CCCCCC'}
      w={'100%'}
      h={'100%'}
      display="flex"
      justifyContent={'center'}
      alignItems={'center'}
      userSelect={'none'}
      cursor={disabled ? 'default' : 'pointer'}
      onClick={disabled ? null : onClick}
      opacity={disabled ? 0.4 : 1.0}
      _hover={{ bg: disabled ? 'none' : '#fafafa' }}
    >
      <Box maxW={'7rem'}>
        <Image quality={100} src={imageProp} alt={supermarket} />
      </Box>
    </Box>
  );
};

const Supermarket: CustomNextPage = () => {
  const router = useRouter();
  const supermarkets = [
    { img: aldiImg, name: 'aldi' },
    { img: asdaImg, name: 'asda' },
    { img: sainsburysImg, name: 'sainsburys' },
    { img: tescoImg, name: 'tesco' },
  ];

  const onNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <StepLayout>
        <Box m={'3rem 2rem'}>
          <Text
            fontSize={{ base: '0.8rem', md: '1rem' }}
            color="gray.normal"
            fontWeight={400}
          >
            Step 2 of 3
          </Text>
          <Text
            fontSize={{ base: '1.25rem', md: '1.5rem' }}
            color="gray.dark"
            fontWeight={600}
            mb={'2rem'}
          >
            Choose your supermarket
          </Text>

          <Grid
            templateColumns="repeat(auto-fill, minMax(180px,1fr));"
            gridAutoRows={'minMax(180px,1fr)'}
            gap={6}
            justifyContent={'center'}
          >
            {supermarkets.map((sm) => {
              return (
                <Box key={sm.name}>
                  <SupermarketButton
                    disabled={sm.name !== 'aldi'}
                    onClick={() =>
                      onNavigate(`/create-plan/servings?supermarket=${sm.name}`)
                    }
                    supermarket={`${sm.name}`}
                    imageProp={sm.img}
                  />
                </Box>
              );
            })}
          </Grid>
        </Box>
      </StepLayout>
    </Layout>
  );
};

Supermarket.requireAuth = true;

export default Supermarket;
