import { Container } from '@chakra-ui/react';

export default function StepLayout({ children }) {
  return (
    <Container pt={'100px'} maxW={'100%'}>
      <Container
        maxW="50rem"
        minH={'40rem'}
        border={'solid #CCCCCC 1px'}
        background={'#ffffff'}
      >
        {children}
      </Container>
    </Container>
  );
}
