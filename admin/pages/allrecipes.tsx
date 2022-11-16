import {
  Box,
  Button,
  Container,
  Flex,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import Layout from '../components/layout';
import { deleteRecipe, getRecipes } from '../utils/requests/recipes';

const RecipeCard = ({
  recipe,
  onDelete,
}: {
  recipe: { id: number; name: string; link: string };
  onDelete: (recipeId: number) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Flex
      bg={'#ffffff'}
      border={'#cccccc'}
      justifyContent={'space-between'}
      alignItems={'center'}
      p={'1rem'}
    >
      <Flex gap={'1rem'}>
        <Box>
          <Text fontSize={'1rem'} fontWeight={100}>
            id
          </Text>

          <Text fontSize={'1rem'}>{recipe.id}</Text>
        </Box>

        <Box>
          <Text fontSize={'1rem'} fontWeight={100}>
            Name
          </Text>

          <Text fontSize={'1rem'}>{recipe.name}</Text>
        </Box>
      </Flex>
      <Button
        colorScheme="brandSecondary"
        onClick={() => {
          setIsLoading(true);
          onDelete(recipe.id);
        }}
        isLoading={isLoading}
      >
        <FiTrash2 />
      </Button>
    </Flex>
  );
};

export default function AllRecipes() {
  const [recipes, setRecipes] = useState<any>([]); // represents viewable recipes list
  const toast = useToast();

  const recipesQuery = useQuery(['recipes'], () => getRecipes(false), {
    refetchOnMount: 'always',
    staleTime: Infinity,
    onSuccess: (data: any) => {
      setRecipes(data);
    },
  });

  const deleteRecipeMutation = useMutation({
    mutationFn: ({ recipeId }: { recipeId: number }) => {
      return deleteRecipe(recipeId);
    },
    onSuccess: async (res: any) => {
      setRecipes((current) => {
        return current.filter((recipe) => recipe.id !== res.id);
      });

      toast({
        position: 'top',
        title: 'Success!',
        description: `Recipe deleted`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        position: 'top',
        title: 'Error!',
        description: 'An error occurred deleting recipe',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  // remove recipe from viewable list
  const onRemoveRecipe = (recipeId: number) => {
    deleteRecipeMutation.mutate({ recipeId });
  };

  return (
    <Layout>
      <Head>
        <title>Admin Dashboard | Plan and Eat Well</title>
      </Head>

      <main>
        <Container maxW={'auto'}>
          <Text fontSize="4xl" color={'#4D4D4D'} mb={'2rem'}>
            All recipes ({recipes.length})
          </Text>

          <Flex justifyContent={'space-between'} gap={'2rem'}>
            <Box flex={2}>
              <Stack pb={'2rem'}>
                {recipes.map((recipe: any) => {
                  return (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onDelete={onRemoveRecipe}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Flex>
        </Container>
      </main>
    </Layout>
  );
}
