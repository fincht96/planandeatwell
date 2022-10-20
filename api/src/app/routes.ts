import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/ping', (req: Request, res: Response) => {
  res.sendStatus(200);
});

router.post('/email', (req: Request, res: Response) => {
  req.container.resolve('emailController').registerCustomerEmail(req, res);
});

export default router;
