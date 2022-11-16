import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const dark = '#232323';
const light = '#fafafa';

const theme = extendTheme({
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode(light, dark)(props),
      },
    }),
  },
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
      bg: 'F#CFCFC',
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
    brandSecondary: {
      '50': '#f3f8fc',
      '100': '#d1e2f1',
      '200': '#a9cae5',
      '300': '#78abd7',
      '400': '#5c99ce',
      '500': '#4182b9',
      '600': '#376d9c',
      '700': '#2c587d',
      '800': '#254a6a',
      '900': '#1b354c',
    },
  },
});

export default theme;
