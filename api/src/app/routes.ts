import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/todos', (req: Request, res: Response) => {
  const todosService = req.container.resolve('todosService');
  const todos = todosService.getTodos();
  res.status(200).send(todos);
});

export default router;
