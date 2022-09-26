import express, { Request, Response } from 'express';
const router = express.Router();

router.post('/email', (req: Request, res: Response) => {
  req.container.resolve('emailController').registerCustomerEmail(req, res);
});

export default router;
