import express, { Request, Response, NextFunction } from 'express';
// const {isAdmin, isUser} from './middleware/authentication'
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

/** email */

router.post('/email', (req: Request, res: Response) => {
  req.container.resolve('emailController').registerCustomerEmail(req, res);
});

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

/** recipe plan */

router.get('/recipe-plan/:id', (req: Request, res: Response) => {
  req.container.resolve('recipePlanController').getRecipePlan(req, res);
});

router.post('/recipe-plan', (req: Request, res: Response) => {
  req.container.resolve('recipePlanController').saveRecipePlan(req, res);
});

router.put('/recipe-plan/:id', (req: Request, res: Response) => {
  req.container.resolve('recipePlanController').updateRecipePlan(req, res);
});

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

export default router;
