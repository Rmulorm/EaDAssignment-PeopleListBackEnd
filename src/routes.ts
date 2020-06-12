import { Router, Request, Response } from 'express';
import listController from './controllers/ListController';

const routes = Router();

routes.get('/', (request: Request, response: Response) => {
  return response.json('This is the Back End of the second class assignment of Advanced Data Structures\nAuthors: Eduardo Cruz e Romulo Maciel');
})

routes.post('/list', listController.create);
routes.get('/list', listController.index);

export default routes;