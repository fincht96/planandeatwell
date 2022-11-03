import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/ping', (req: Request, res: Response) => {
  res.sendStatus(200);
});

router.post('/email', (req: Request, res: Response) => {
  req.container.resolve('emailController').registerCustomerEmail(req, res);
});

/** ingredients */

router.get('/ingredients', (req: Request, res: Response) =>
  req.container.resolve('ingredientsController').getIngredients(req, res),
);

/** recipe plan */

router.get('/recipe-plan/:id', (req: Request, res: Response) => {
  req.container.resolve('recipePlanController').getRecipePlan(req, res);
});

router.post('/recipe-plan', (req: Request, res: Response) => {
  req.container.resolve('recipePlanController').saveRecipePlan(req, res);
});

export default router;
