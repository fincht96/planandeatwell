import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();

const isAuthenticated =
  (role: string) => (req: Request, res: Response, next: NextFunction) => {
    return req.container
      .resolve('authenticationMiddleware')
      .isAuthenticated(role, req, res, next);
  };

router.get('/ping', (req: Request, res: Response) => {
  res.sendStatus(200);
});

/** supermarkets */

router.get('/supermarkets', (req: Request, res: Response) =>
  req.container.resolve('supermarketsController').getSupermarkets(req, res),
);

/** categories */

router.get('/categories', (req: Request, res: Response) =>
  req.container.resolve('categoriesController').getCategories(req, res),
);

/** ingredients */

router.get('/ingredients', (req: Request, res: Response) =>
  req.container.resolve('ingredientsController').getIngredients(req, res),
);

router.post(
  '/ingredient',
  isAuthenticated('admin'),
  (req: Request, res: Response) => {
    req.container.resolve('ingredientsController').insertIngredient(req, res);
  },
);

router.delete(
  '/ingredient/:id',
  isAuthenticated('admin'),
  (req: Request, res: Response) =>
    req.container.resolve('ingredientsController').removeIngredient(req, res),
);

router.put(
  '/ingredients/update-prices',
  isAuthenticated('admin'),
  (req: Request, res: Response) =>
    req.container.resolve('ingredientsController').updatePrices(req, res),
);

/** recipes */

router.get('/recipes', (req: Request, res: Response) =>
  req.container.resolve('recipeController').getRecipeList(req, res),
);

router.post(
  '/recipe',
  isAuthenticated('admin'),
  (req: Request, res: Response) =>
    req.container.resolve('recipeController').insertRecipe(req, res),
);

router.delete(
  '/recipe/:id',
  isAuthenticated('admin'),
  (req: Request, res: Response) =>
    req.container.resolve('recipeController').removeRecipe(req, res),
);

/** meal plan */

router.get(
  '/meal-plans',
  isAuthenticated('user'),
  (req: Request, res: Response) => {
    req.container.resolve('mealPlanController').getMealPlans(req, res);
  },
);

router.get('/meal-plan/:mealPlanUuid', (req: Request, res: Response) => {
  req.container.resolve('mealPlanController').getMealPlan(req, res);
});

router.post(
  '/meal-plan',
  isAuthenticated('user'),
  (req: Request, res: Response) => {
    req.container.resolve('mealPlanController').saveMealPlan(req, res);
  },
);

router.put(
  '/meal-plan/:mealPlanUuid',
  isAuthenticated('user'),
  (req: Request, res: Response) => {
    req.container.resolve('mealPlanController').updateMealPlan(req, res);
  },
);

router.delete(
  '/meal-plan/:mealPlanUuid',
  isAuthenticated('user'),
  (req: Request, res: Response) =>
    req.container.resolve('mealPlanController').removeMealPlan(req, res),
);

/** storage */

router.get(
  '/signed-upload-url',
  isAuthenticated('admin'),
  (req: Request, res: Response) => {
    req.container.resolve('storageController').getSignedUploadUrl(req, res);
  },
);

/** user */

router.post('/user/sync-claims', (req: Request, res: Response) => {
  req.container.resolve('userController').syncClaims(req, res);
});

router.post('/user/create', (req: Request, res: Response) => {
  req.container.resolve('userController').createAccount(req, res);
});

router.post('/user/early-access', (req: Request, res: Response) => {
  req.container.resolve('userController').requestEarlyAccess(req, res);
});

export default router;
