"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMilestoneSchema = exports.createMilestoneSchema = void 0;
const zod_1 = require("zod");
exports.createMilestoneSchema = zod_1.z.object({
    projectId: zod_1.z.string().cuid(),
    name: zod_1.z.string().min(1, 'Milestone name is required').max(200),
    description: zod_1.z.string().max(500).optional(),
    amount: zod_1.z.number().positive('Amount must be positive'),
    status: zod_1.z.enum(['pending', 'completed', 'paid']).default('pending'),
    dueDate: zod_1.z.string().datetime(),
});
exports.updateMilestoneSchema = exports.createMilestoneSchema.partial();
//# sourceMappingURL=milestone.validator.js.map