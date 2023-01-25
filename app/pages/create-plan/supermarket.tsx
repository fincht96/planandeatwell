import { Box, Container, Grid, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import BorderBox from '../../components/BorderBox';
import Layout, { siteTitle } from '../../components/layout';
import aldiImg from '../../public/images/aldi.png';
import asdaImg from '../../public/images/asda.png';
import sainsburysImg from '../../public/images/sainsburys.png';
import tescoImg from '../../public/images/tesco.png';
import { SupermarketType } from '../../types/supermarket.types';
import { getSupermarkets } from '../../utils/requests/supermarkets';

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
    <BorderBox
      borderColor="gray.light"
      w={'100%'}
      h={'100%'}
      display="flex"
      justifyContent={'center'}
      alignItems={'center'}
      userSelect={'none'}
      cursor={disabled ? 'default' : 'pointer'}
      onClick={disabled ? null : onClick}
      opacity={disabled ? 0.4 : 1.0}
      _hover={{ bg: disabled ? 'none' : 'brand.100' }}
    >
      <Box maxW={'6rem'}>
        <Image quality={100} src={imageProp} alt={supermarket} />
      </Box>
    </BorderBox>
  );
};

const Steps: NextPage = () => {
  const router = useRouter();
  const [supermarkets, setSupermarkets] = useState<Array<any>>([]);

  useQuery(
    [`supermarkets`],
    () => {
      return getSupermarkets();
    },
    {
      enabled: true,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
      onSuccess: (data: Array<SupermarketType>) => {
        const supermarketsTemp: Array<any> = [
          { img: aldiImg, name: 'Aldi' },
          { img: asdaImg, name: 'Asda' },
          { img: sainsburysImg, name: 'Sainsburys' },
          { img: tescoImg, name: 'Tesco' },
        ];

        const decoratedSupermarket = data.reduce(
          (prev: Array<SupermarketType>, current: SupermarketType) => {
            const { img } = supermarketsTemp.find(
              (supermarket) => supermarket.name === current.name,
            );

            return [
              ...prev,
              {
                ...current,
                image: img,
              },
            ];
          },
          [],
        );

        setSupermarkets(decoratedSupermarket);
      },
    },
  );

  const onNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <Container maxH="1000px" maxW="800px" padding="0 2rem 2.5rem">
        <Box>
          <Text
            mb="2rem"
            fontSize={{ base: '1.4rem', sm: '1.7rem', md: '2rem' }}
            color="black"
            fontWeight={600}
            textAlign={{ base: 'center', lg: 'left' }}
          >
            Choose your supermarket
          </Text>

          <Grid
            templateColumns="repeat(auto-fill, minMax(180px,1fr));"
            gridAutoRows={'minMax(180px,1fr)'}
            gap={6}
            justifyContent={'center'}
          >
            {supermarkets.map((supermarket) => {
              return (
                <Box key={supermarket.name}>
                  <SupermarketButton
                    disabled={supermarket.name !== 'Aldi'}
                    onClick={() =>
                      onNavigate(
                        `/create-plan/menu?supermarketId=${supermarket.id}`,
                      )
                    }
                    supermarket={`${supermarket.name}`}
                    imageProp={supermarket.image}
                  />
                </Box>
              );
            })}
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default Steps;
