import type { NextPage } from 'next';
import Head from 'next/head';
import Layout, { siteTitle } from '../../components/layout';
import { Box, Container, useMediaQuery } from '@chakra-ui/react';
import { getRecipes } from '../../utils/api-requests/recipes';
import Image from 'next/image';
import BorderBox from '../../components/BorderBox';
import {
  RecipeViewDesktop,
  RecipeViewMobile,
} from '../../components/recipes/RecipeViews';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  roundUpQuantities,
  scaleIngredientQuantities,
  calcTotalIngredientsPrice,
  addPreciseQuantity,
} from '../../utils/recipeHelper';
import { roundTo2dp } from '../../utils/roundTo2dp';

const Recipe: NextPage = ({ recipe }: any) => {
  const updatedSiteTitle = `Recipe | ${siteTitle}`;
  const [isLessThan900] = useMediaQuery('(max-width: 900px)');
  const [ingredients, setIngredients] = useState<Array<any>>(
    recipe.ingredientsList,
  );
  const [pricePerServing, setPricePerServing] = useState<number>(
    recipe.pricePerServing,
  );
  const [currentServings, setCurrentServings] = useState<number>(
    recipe.baseServings,
  );
  const router = useRouter();

  useEffect(() => {
    if (router.isReady && router.query['servings']) {
      const selectedServings = Number(router.query['servings']);

      if (recipe.baseServings !== selectedServings) {
        // if base serving does not equal selected serving use selected servings to calculate ingredients and price per serving
        const decoratedIngredients = addPreciseQuantity(
          roundUpQuantities(
            scaleIngredientQuantities(
              recipe.ingredientsList,
              recipe.baseServings,
              selectedServings,
            ),
          ),
        );

        const totalPrice = calcTotalIngredientsPrice(decoratedIngredients);
        const pricePerServing = roundTo2dp(totalPrice / selectedServings);

        // ingredients & price per serving derived from selected servings value
        setCurrentServings(selectedServings);
        setIngredients(decoratedIngredients);
        setPricePerServing(pricePerServing);
      }
    }
  }, [router, recipe]);

  return (
    <>
      <Layout excludeFooter>
        <Head>
          <title>{updatedSiteTitle}</title>
        </Head>
        <Box>
          <Container maxW="1200px" mb={4}>
            <BorderBox my={2} width={'100%'} height={300} position={'relative'}>
              <Image
                src={`${process.env.NEXT_PUBLIC_CDN}${recipe.imagePath}`}
                alt={recipe.name}
                layout={'fill'}
                objectFit="cover"
                priority
              />
            </BorderBox>
          </Container>
          <Container maxW="1200px">
            {!!isLessThan900
              ? RecipeViewMobile(recipe, {
                  pricePerServing,
                  currentServings,
                  ingredients: ingredients,
                })
              : RecipeViewDesktop(recipe, {
                  pricePerServing,
                  currentServings,
                  ingredients: ingredients,
                })}
          </Container>
        </Box>
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  if (process.env.NEXT_PUBLIC_ENV === 'development') {
    const paths: Array<any> = [];
    return { paths, fallback: 'blocking' };
  } else {
    const res: any = await getRecipes({
      includeIngredientsWithRecipes: false,
      offset: 0,
      limit: 100,
      order: 'any',
      orderBy: 'relevance',
    });

    const paths: Array<any> = res.recipes.map((recipe: any) => {
      return {
        params: { recipeId: recipe.id.toString() },
      };
    });

    return {
      paths,
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps(context: any) {
  const recipeId = context.params.recipeId;

  // getting one specific recipe
  const res: any = await getRecipes({
    includeIngredientsWithRecipes: true,
    offset: 0,
    limit: 1,
    order: 'any',
    orderBy: 'relevance',
    recipeIds: [parseInt(recipeId)],
  });

  const recipe = res.recipes[0];

  return {
    props: {
      recipe: recipe,
      revalidate: process.env.NEXT_PUBLIC_ENV === 'development' ? 0 : 3600,
    },
  };
}

export default Recipe;
