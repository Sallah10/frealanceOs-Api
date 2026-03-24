"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectSchema = exports.createProjectSchema = void 0;
const zod_1 = require("zod");
exports.createProjectSchema = zod_1.z.object({
    clientId: zod_1.z.string().cuid(),
    name: zod_1.z.string().min(1, 'Project name is required').max(200),
    description: zod_1.z.string().max(1000).optional(),
    status: zod_1.z.enum(['planning', 'active', 'completed', 'on_hold']).default('planning'),
    budget: zod_1.z.number().positive('Budget must be positive'),
    currency: zod_1.z.string().length(3).default('USD'),
    deadline: zod_1.z.string().datetime().optional(),
});
exports.updateProjectSchema = exports.createProjectSchema.partial();
//# sourceMappingURL=project.validator.js.map