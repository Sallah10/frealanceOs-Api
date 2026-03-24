// src/routes/milestones.ts
import { Router } from 'express';
import { MilestoneController } from '../controllers/milestone.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createMilestoneSchema, updateMilestoneSchema } from '../validators/milestone.validator';

const router = Router();
const milestoneController = new MilestoneController();

router.use(authenticate);

router.get('/', milestoneController.findAll);
router.get('/:id', milestoneController.findOne);
router.post('/', validate(createMilestoneSchema), milestoneController.create);
router.put('/:id', validate(updateMilestoneSchema), milestoneController.update);
router.delete('/:id', milestoneController.delete);

export default router;