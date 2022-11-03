import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  breakpoints: {
    sm: '320px',
    md: '768px',
    lg: '1006px',
    xl: '1200px',
  },
  fonts: {
    heading: `Roboto, sans-serif`,
    body: `Roboto, sans-serif`,
  },
  colors: {
    transparent: 'transparent',
    black: '#000',
    white: '#fff',
    gray: {
      bg: '#FCFCFC',
      light: '#aaaaaa',
      normal: '#777777',
      dark: '#444444',
    },
    brand: {
      '50': '#EBF9F5',
      '100': '#C8EFE2',
      '200': '#A4E5D0',
      '300': '#80DABD',
      '400': '#5DD0AB',
      '500': '#39C698',
      '600': '#2E9E7A',
      '700': '#22775B',
      '800': '#174F3D',
      '900': '#0B281E',
    },
  },
});

export default theme;
