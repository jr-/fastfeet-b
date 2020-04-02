import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import CourierController from './app/controllers/CourierController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryPickedController from './app/controllers/DeliveryPickedController';
import DeliveryDeliveredController from './app/controllers/DeliveryDeliveredController';
import CourierDeliveryController from './app/controllers/CourierDeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import ProblemController from './app/controllers/ProblemController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/couriers/:id/deliveries/:delivered', CourierDeliveryController.index.bind(CourierDeliveryController));

routes.put('/couriers/:cid/deliveries/:did/picked',
            DeliveryPickedController.update.bind(DeliveryPickedController)
          );
routes.put('/couriers/:cid/deliveries/:did/delivered',
            upload.single('file'),
            DeliveryDeliveredController.update.bind(DeliveryDeliveredController)
          );
routes.get('/deliveries/:id/problems', DeliveryProblemController.index.bind(DeliveryProblemController));
routes.post('/deliveries/:id/problems', DeliveryProblemController.store.bind(DeliveryProblemController));


routes.use(authMiddleware);

routes.get('/problems', ProblemController.index.bind(ProblemController));
routes.delete('/problems/:id/cancel-delivery', ProblemController.delete.bind(ProblemController));

routes.get('/recipients', RecipientController.index.bind(RecipientController));
routes.post('/recipients', RecipientController.store.bind(RecipientController));
routes.put('/recipients/:id', RecipientController.update.bind(RecipientController));

routes.get('/couriers', CourierController.index.bind(CourierController));
routes.post('/couriers', upload.single('file'), CourierController.store.bind(CourierController));
routes.put('/couriers/:id', upload.single('file'), CourierController.update.bind(CourierController));
routes.delete('/couriers/:id', CourierController.delete.bind(CourierController));

routes.get('/deliveries', DeliveryController.index.bind(DeliveryController));
routes.post('/deliveries', DeliveryController.store.bind(DeliveryController));
routes.put('/deliveries/:id', DeliveryController.update.bind(DeliveryController));
routes.delete('/deliveries/:id', DeliveryController.delete.bind(DeliveryController));

export default routes;
