import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const dark = '#232323';
const light = '#ffffff';

const theme = extendTheme({
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode(light, dark)(props),
      },
    }),
  },
  breakpoints: {
    sm: '400px',
    md: '768px',
    lg: '1006px',
    xl: '1200px',
    '1xl': '1350px',
    '2xl': '1400px',
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  colors: {
    transparent: 'transparent',
    black: '#000',
    white: '#fff',
    gray: {
      bg: 'F#CFCFC',
      searchBoxGray: 'rgba(228, 228, 228, 0.3)',
      veryLightGray: '#E7EFEC',
      lighterGray: '#F7FAFC',
      light: '#aaaaaa',
      bone: '#808191',
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
    components: {
      Popover: { baseStyle: { _focus: { boxShadow: 'none' } } },
      Button: { baseStyle: { _focus: { boxShadow: 'none' } } },
    },
  },
});

export default theme;
