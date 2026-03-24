// src/routes/clients.ts
import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createClientSchema, updateClientSchema } from '../validators/client.validator';

const router = Router();
const clientController = new ClientController();

router.use(authenticate);

router.get('/', clientController.findAll);
router.get('/:id', clientController.findOne);
router.post('/', validate(createClientSchema), clientController.create);
router.put('/:id', validate(updateClientSchema), clientController.update);
router.delete('/:id', clientController.delete);

export default router;