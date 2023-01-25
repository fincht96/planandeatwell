import { Link } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { SlArrowDown } from 'react-icons/sl';

const NavDown = (props: any) => {
  return (
    <Link
      href={props.link ?? '#'}
      color={props.color ?? 'gray.normal'}
      _hover={{
        textDecoration: 'none',
        color: 'brand.500',
      }}
    >
      <ChevronDownIcon w={65} h={65} color="inherit" />
    </Link>
  );
};

export default NavDown;
