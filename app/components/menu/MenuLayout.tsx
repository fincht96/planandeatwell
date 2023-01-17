import Meta from '../meta';
import Navbar from '../Navbar';
import RecipeBasketButton from './RecipeBasketButton';

export const siteTitle = 'Meal Planner | Plan and Eat Well';

export default function MenuLayout({
  children,
  includeNavBar = true,
  currentPrice,
  ingredientList,
  recipeList,
  servings,
  onComplete,
  onAddRecipeServings,
  onRemoveRecipeServings,
}: {
  children: any;
  includeNavBar?: boolean;
  currentPrice: number;
  ingredientList: Array<any>;
  recipeList: Array<any>;
  servings: number;
  onComplete: any;
  onAddRecipeServings: (recipe, servings) => void;
  onRemoveRecipeServings: (recipe, servings) => void;
}) {
  return (
    <>
      <Meta />
      {includeNavBar ? (
        <header>
          <Navbar
            recipeBasketButton={
              <RecipeBasketButton
                currentPrice={currentPrice}
                ingredientList={ingredientList}
                recipeList={recipeList}
                servings={servings}
                onComplete={onComplete}
                onAddRecipeServings={onAddRecipeServings}
                onRemoveRecipeServings={onRemoveRecipeServings}
              />
            }
          >
            <div>
              <main>{children}</main>
            </div>
          </Navbar>
        </header>
      ) : (
        <div>
          <main>{children}</main>
        </div>
      )}
    </>
  );
}
