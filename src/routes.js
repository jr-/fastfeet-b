import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import CourierController from './app/controllers/CourierController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store.bind(RecipientController));
routes.put('/recipients/:id', RecipientController.update.bind(RecipientController));

routes.get('/couriers', CourierController.index.bind(CourierController));
routes.post('/couriers', upload.single('file'), CourierController.store.bind(CourierController));
routes.put('/couriers/:id', upload.single('file'), CourierController.update.bind(CourierController));
routes.delete('/couriers/:id', CourierController.delete.bind(CourierController));

export default routes;
