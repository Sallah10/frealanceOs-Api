// src/routes/projects.ts
import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator';

const router = Router();
const projectController = new ProjectController();

router.use(authenticate);

router.get('/', projectController.findAll);
router.get('/:id', projectController.findOne);
router.get('/:id/milestones', projectController.getMilestones);
router.post('/', validate(createProjectSchema), projectController.create);
router.put('/:id', validate(updateProjectSchema), projectController.update);
router.delete('/:id', projectController.delete);

export default router;