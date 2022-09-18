import { Request, Response } from 'express';
import { TodosService } from '../services/todos_service';

// api / controller

// Here's a Express API that calls the service
export class TodosController {
  private todosService: TodosService;

  constructor({ todosService }: { todosService: TodosService }) {
    this.todosService = todosService;
  }

  // express context
  getTodos(req: Request, res: Response) {
    return res.send(this.todosService.getTodos());
  }
}
