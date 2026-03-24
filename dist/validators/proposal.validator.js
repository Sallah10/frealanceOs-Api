"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProposalSchema = exports.createProposalSchema = void 0;
const zod_1 = require("zod");
exports.createProposalSchema = zod_1.z.object({
    clientId: zod_1.z.string().cuid(),
    title: zod_1.z.string().min(1, 'Title is required').max(200),
    content: zod_1.z.string().min(1, 'Content is required'),
    amount: zod_1.z.number().positive('Amount must be positive'),
    currency: zod_1.z.string().length(3).default('USD'),
    validUntil: zod_1.z.string().datetime().optional(),
});
exports.updateProposalSchema = exports.createProposalSchema.partial();
//# sourceMappingURL=proposal.validator.js.map