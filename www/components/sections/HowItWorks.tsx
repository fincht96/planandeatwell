import {
  Text,
  Stack,
  Container,
  SimpleGrid,
  StackDivider,
  Flex,
  Image,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactElement } from 'react';
import { IoStorefrontOutline } from 'react-icons/io5';
import { BsPencilSquare } from 'react-icons/bs';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { RiShareLine } from 'react-icons/ri';
import { AiOutlineSelect } from 'react-icons/ai';

interface FeatureProps {
  text: string;
  iconBg: string;
  icon?: ReactElement;
}

const Feature = ({ text, icon, iconBg }: FeatureProps) => {
  return (
    <Stack direction={'row'} align={'center'}>
      <Flex
        w={8}
        h={8}
        align={'center'}
        justify={'center'}
        rounded={'full'}
        bg={iconBg}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{text}</Text>
    </Stack>
  );
};

const HowItWorks = () => {
  return (
    <Container
      maxW="1200px"
      my={10}
      sx={{ position: 'relative' }}
      py={{ base: 'none', sm: 5 }}
    >
      <span id="how-it-works" style={{ position: 'absolute', top: '-120px' }} />
      <Stack spacing={3} mb={3}>
        <Text
          fontSize="md"
          color="brand.500"
          fontWeight={700}
          textAlign="center"
        >
          Simple and easy
        </Text>
        <Text
          fontSize={{ base: '1.9rem', md: '2.25rem' }}
          color="black"
          fontWeight={800}
          textAlign="center"
        >
          How it works
        </Text>
        <Text
          fontSize={{ base: '1rem', md: '1.2rem' }}
          color="gray.dark"
          fontWeight="400"
          textAlign="center"
        >
          Plan simple and healthy meals using ingredients at the supermarket on
          any budget with minimal effort.
        </Text>
      </Stack>
      <Stack mt={{ base: 3, md: 10 }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <Stack spacing={4}>
            <Text
              color="gray.dark"
              fontSize={'lg'}
              fontWeight="600"
              textAlign={{ base: 'center', sm: 'left' }}
            >
              5 steps
            </Text>

            <Stack
              spacing={4}
              divider={
                <StackDivider
                  borderColor={useColorModeValue('gray.100', 'gray.700')}
                />
              }
            >
              <Feature
                icon={
                  <Icon as={IoStorefrontOutline} color="white" w={5} h={5} />
                }
                iconBg={useColorModeValue('brand.500', 'brand.100')}
                text={'Choose your supermarket'}
              />
              <Feature
                icon={<Icon as={AiOutlineSelect} color="white" w={5} h={5} />}
                iconBg={useColorModeValue('brand.500', 'brand.100')}
                text={'Select recipes for your meal plan'}
              />
              <Feature
                icon={<Icon as={BsPencilSquare} color="white" w={5} h={5} />}
                iconBg={useColorModeValue('brand.500', 'brand.100')}
                text={'Create meal plan'}
              />
              <Feature
                icon={
                  <Icon as={AiOutlineShoppingCart} color="white" w={5} h={5} />
                }
                iconBg={useColorModeValue('brand.500', 'brand.100')}
                text={'Shop using meal plan'}
              />
              <Feature
                icon={<Icon as={RiShareLine} color="white" w={5} h={5} />}
                iconBg={useColorModeValue('brand.500', 'brand.100')}
                text={'Share meal plan with friends'}
              />
            </Stack>
          </Stack>
          <Flex>
            <Image
              rounded={'md'}
              alt={'feature image'}
              src={'/Nutrition-plan.svg'}
              objectFit={'cover'}
            />
          </Flex>
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

export default HowItWorks;
