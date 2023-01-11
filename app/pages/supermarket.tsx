import { Box, Grid, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout, { siteTitle } from '../components/layout';
import StepLayout from '../components/StepLayout';
import aldiImg from '../public/images/aldi.png';
import asdaImg from '../public/images/asda.png';
import sainsburysImg from '../public/images/sainsburys.png';
import tescoImg from '../public/images/tesco.png';
import { SupermarketType } from '../types/supermarket.types';
import { getSupermarkets } from '../utils/requests/supermarkets';

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
      </StepLayout>
    </Layout>
  );
};

export default Steps;
