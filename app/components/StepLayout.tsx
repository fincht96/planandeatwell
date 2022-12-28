import { Container } from '@chakra-ui/react';

export default function StepLayout({ children }: { children: any }) {
  return (
    <Container maxW={'100%'}>
      <Container
        maxW="50rem"
        border={'solid #CCCCCC 1px'}
        borderColor={'gray.200'}
        background={'#ffffff'}
        mb={'2rem'}
        borderRadius={'lg'}
      >
        {children}
      </Container>
    </Container>
  );
}
