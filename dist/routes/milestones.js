"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const milestone_controller_1 = require("../controllers/milestone.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const milestone_validator_1 = require("../validators/milestone.validator");
const router = (0, express_1.Router)();
const milestoneController = new milestone_controller_1.MilestoneController();
router.use(auth_1.authenticate);
router.get('/', milestoneController.findAll);
router.get('/:id', milestoneController.findOne);
router.post('/', (0, validation_1.validate)(milestone_validator_1.createMilestoneSchema), milestoneController.create);
router.put('/:id', (0, validation_1.validate)(milestone_validator_1.updateMilestoneSchema), milestoneController.update);
router.delete('/:id', milestoneController.delete);
exports.default = router;
//# sourceMappingURL=milestones.js.map