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
  iconBg?: string;
  icon?: ReactElement;
  subText?: string;
}

const Feature = ({ text, icon, iconBg, subText }: FeatureProps) => {
  return (
    <Stack direction={'row'} align={'center'}>
      {icon && (
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
      )}
      <Flex flexDirection="column" width="500px">
        <Text fontWeight={600}>{text}</Text>
        <Text fontSize="1rem" color="gray.dark" fontWeight={400}>
          {subText}
        </Text>
      </Flex>
    </Stack>
  );
};

const HowItWorks = ({ campaignId }: { campaignId: number }) => {
  return (
    <Container
      maxW="1200px"
      my={10}
      sx={{ position: 'relative' }}
      py={{ base: 'none', sm: 5 }}
    >
      <span id="how-it-works" style={{ position: 'absolute', top: '-120px' }} />
      {campaignId === 0 && (
        <>
          <Stack spacing={3} mb={3}>
            <Text
              fontSize={{ base: 'sm', md: 'md' }}
              color="brand.500"
              fontWeight={700}
              textAlign="center"
            >
              Simple and easy
            </Text>
            <Text
              fontSize={{ base: '1.4rem', sm: '1.9rem', md: '2.25rem' }}
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
              Plan simple and healthy meals using ingredients at the supermarket
              on any budget with minimal effort.
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

                <Stack spacing={4}>
                  <Feature
                    icon={
                      <Icon
                        as={IoStorefrontOutline}
                        color="white"
                        w={5}
                        h={5}
                      />
                    }
                    // iconBg={useColorModeValue('brand.500', 'brand.100')}
                    iconBg={'brand.500'}
                    text={'Choose your supermarket'}
                  />
                  <Feature
                    icon={
                      <Icon as={AiOutlineSelect} color="white" w={5} h={5} />
                    }
                    // iconBg={useColorModeValue('brand.500', 'brand.100')}
                    iconBg={'brand.500'}
                    text={'Select recipes for your meal plan'}
                  />
                  <Feature
                    icon={
                      <Icon as={BsPencilSquare} color="white" w={5} h={5} />
                    }
                    // iconBg={useColorModeValue('brand.500', 'brand.100')}
                    iconBg={'brand.500'}
                    text={'Create meal plan'}
                  />
                  <Feature
                    icon={
                      <Icon
                        as={AiOutlineShoppingCart}
                        color="white"
                        w={5}
                        h={5}
                      />
                    }
                    // iconBg={useColorModeValue('brand.500', 'brand.100')}
                    iconBg={'brand.500'}
                    text={'Shop using meal plan'}
                  />
                  <Feature
                    icon={<Icon as={RiShareLine} color="white" w={5} h={5} />}
                    // iconBg={useColorModeValue('brand.500', 'brand.100')}
                    iconBg={'brand.500'}
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
        </>
      )}
      {campaignId === 1 && (
        <>
          <Stack spacing={3} mb={3}>
            <Text
              fontSize={{ base: 'sm', md: 'md' }}
              color="brand.500"
              fontWeight={700}
              textAlign="center"
            >
              Unleash your creativity and grow your food brand.
            </Text>
            <Text
              fontSize={{ base: '1.2rem', xl: '1.45rem' }}
              color="black"
              fontWeight={800}
              textAlign="center"
            >
              Benefits
            </Text>
            {/* <Text
              fontSize={{ base: '1rem', md: '1.2rem' }}
              color="gray.dark"
              fontWeight="400"
              textAlign="center"
            >
              Plan simple and healthy meals using ingredients at the supermarket
              on any budget with minimal effort.
            </Text> */}
          </Stack>
          <Stack mt={{ base: 3, md: 10 }}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <Stack spacing={4}>
                {/* <Text
                  color="gray.dark"
                  fontSize={'lg'}
                  fontWeight="600"
                  textAlign={{ base: 'center', sm: 'left' }}
                >
                  Our benefits
                </Text> */}

                <Stack spacing={4}>
                  <Feature
                    // icon={
                    //   <Icon
                    //     as={IoStorefrontOutline}
                    //     color="white"
                    //     w={7}
                    //     h={7}
                    //   />
                    // }
                    // iconBg={useColorModeValue('brand.500', 'brand.100')}
                    text={'Recipe creation and organization'}
                    subText={
                      'Easily create and manage your recipes, complete with ingredient lists, cooking instructions, and photos. Track of all your recipes in one place.'
                    }
                  />
                  <Feature
                    // icon={
                    //   <Icon as={AiOutlineSelect} color="white" w={5} h={5} />
                    // }
                    // iconBg={useColorModeValue('brand.500', 'brand.100')}
                    text={'Meal planning'}
                    subText={
                      'Use our powerful meal planning feature. Create meal plans, assign recipes to specific meals, and generate shopping lists with ease.'
                    }
                  />
                  <Feature
                    // icon={
                    //   <Icon as={BsPencilSquare} color="white" w={5} h={5} />
                    // }
                    // iconBg={useColorModeValue('brand.500', 'brand.100')}
                    text={'Merchandise sales'}
                    subText={
                      'Sell your merchandise and reach a wider audience. Whether you want to sell recipe books, cooking tools, or food-themed clothing, you can use the app to reach your fans and grow your brand.'
                    }
                  />
                  <Feature
                    // icon={
                    //   <Icon
                    //     as={AiOutlineShoppingCart}
                    //     color="white"
                    //     w={5}
                    //     h={5}
                    //   />
                    // }
                    // iconBg={useColorModeValue('brand.500', 'brand.100')}
                    text={'Social sharing'}
                    subText={
                      'Share your recipes and meal plans with a wider audience using our social sharing feature. Post your recipes to social media platforms like Facebook, Instagram, and Twitter, with a single click.'
                    }
                  />
                  <Feature
                    // icon={<Icon as={RiShareLine} color="white" w={5} h={5} />}
                    // iconBg={useColorModeValue('brand.500', 'brand.100')}
                    text={'Analytics and insights'}
                    subText={
                      'Get a better understanding of your audience and grow your brand with our analytics and insights. The app provides valuable data on your audience and the performance of your content, so you can make informed decisions about your content and marketing strategies.'
                    }
                  />
                </Stack>
              </Stack>
              <Flex>
                <Image
                  objectFit={'contain'}
                  rounded={'md'}
                  alt={'feature image'}
                  src={'/graph.svg'}
                />
              </Flex>
            </SimpleGrid>
          </Stack>
        </>
      )}
    </Container>
  );
};

export default HowItWorks;
