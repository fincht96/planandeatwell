import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Supermarket } from '../../types/supermarket.types';
import { getIngredientsSearch } from '../../utils/requests/ingredients';
interface Ingredient {
  id: number;
  name: string;
  pricePerUnit: number;
  link?: string;
}

const ResultCard = ({
  ingredient,
  onAdd,
}: {
  ingredient: Ingredient;
  onAdd: (ingredient: Ingredient) => void;
}) => {
  return (
    <Flex
      justifyContent={'space-between'}
      alignItems={'center'}
      padding={'1rem 0'}
      borderBottom={'solid 1px #cccccc'}
    >
      <Text>{ingredient.name}</Text>
      <Button onClick={() => onAdd(ingredient)}>Add</Button>
    </Flex>
  );
};

export default function IngredientsSearchModal({
  isOpen,
  onClose,
  onSubmit,
  selectedSupermarket,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ingredient: Ingredient) => void;
  selectedSupermarket: Supermarket;
}) {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [searchString, setSearchString] = useState('');
  const [results, setResults] = useState<Array<Ingredient>>([]);

  useQuery({
    queryKey: [`ingredientsQuery`, searchString],
    queryFn: () => getIngredientsSearch({ searchString, selectedSupermarket }),
    refetchOnMount: false,
    enabled: !!searchString.length,
    staleTime: 0,
    onSuccess: (data: Array<Ingredient>) => {
      setResults(data);
    },
  });

  useEffect(() => {
    if (!isOpen) {
      setSearchString('');
      setResults([]);
      reset();
    }
  }, [isOpen, reset]);

  const onSearchSubmit = (data) => {
    setSearchString(data.searchString);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={'2rem 0'}>
          <ModalHeader as={Text} fontSize={'2xl'} fontWeight={'400'}>
            Ingredients Search for {selectedSupermarket.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSearchSubmit)} autoComplete="off">
              <FormControl isInvalid={!!errors.searchString} mb={'2rem'}>
                <Flex gap={'1rem'}>
                  <Input
                    variant="outline"
                    autoComplete="off"
                    bg={'#ffffff'}
                    id={'searchString'}
                    {...register('searchString', {
                      required: 'A search string is required',
                      maxLength: {
                        value: 100,
                        message: 'Must be less than 100 characters',
                      },
                    })}
                  />
                  <Button type="submit" colorScheme={'brandSecondary'}>
                    Search
                  </Button>
                </Flex>
                <FormErrorMessage>
                  {errors.searchString && `${errors?.searchString.message}`}
                </FormErrorMessage>
              </FormControl>
            </form>

            <Text borderBottom={'solid 1px #cccccc'} paddingBottom={'1rem'}>
              Results ({results.length})
            </Text>

            <Stack>
              {results.map((ingredient) => {
                return (
                  <ResultCard
                    ingredient={ingredient}
                    onAdd={onSubmit}
                    key={ingredient.id}
                  />
                );
              })}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
