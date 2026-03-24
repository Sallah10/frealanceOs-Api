"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const project_validator_1 = require("../validators/project.validator");
const router = (0, express_1.Router)();
const projectController = new project_controller_1.ProjectController();
router.use(auth_1.authenticate);
router.get('/', projectController.findAll);
router.get('/:id', projectController.findOne);
router.get('/:id/milestones', projectController.getMilestones);
router.post('/', (0, validation_1.validate)(project_validator_1.createProjectSchema), projectController.create);
router.put('/:id', (0, validation_1.validate)(project_validator_1.updateProjectSchema), projectController.update);
router.delete('/:id', projectController.delete);
exports.default = router;
//# sourceMappingURL=projects.js.map