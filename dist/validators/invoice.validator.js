"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInvoiceSchema = exports.createInvoiceSchema = void 0;
const zod_1 = require("zod");
const invoiceItemSchema = zod_1.z.object({
    description: zod_1.z.string().min(1),
    quantity: zod_1.z.number().positive(),
    rate: zod_1.z.number().positive(),
});
exports.createInvoiceSchema = zod_1.z.object({
    clientId: zod_1.z.string().cuid(),
    projectId: zod_1.z.string().cuid().optional(),
    amount: zod_1.z.number().positive('Amount must be positive'),
    currency: zod_1.z.string().length(3).default('USD'),
    dueDate: zod_1.z.string().datetime(),
    items: zod_1.z.array(invoiceItemSchema),
    notes: zod_1.z.string().max(500).optional(),
    taxRate: zod_1.z.number().min(0).max(100).default(0),
});
exports.updateInvoiceSchema = exports.createInvoiceSchema.partial();
//# sourceMappingURL=invoice.validator.js.map