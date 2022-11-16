import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/ping', (req: Request, res: Response) => {
  res.sendStatus(200);
});

/** email */

router.post('/email', (req: Request, res: Response) => {
  req.container.resolve('emailController').registerCustomerEmail(req, res);
});

/** ingredients */

router.get('/ingredients', (req: Request, res: Response) =>
  req.container.resolve('ingredientsController').getIngredients(req, res),
);

/** recipes */

router.get('/recipes', (req: Request, res: Response) =>
  req.container.resolve('recipeController').getRecipeList(req, res),
);

router.post('/recipe', (req: Request, res: Response) =>
  req.container.resolve('recipeController').insertRecipe(req, res),
);

router.delete('/recipe/:id', (req: Request, res: Response) =>
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

router.get('/signed-upload-url', (req: Request, res: Response) => {
  req.container.resolve('storageController').getSignedUploadUrl(req, res);
});

export default router;
