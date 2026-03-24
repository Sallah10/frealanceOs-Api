"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClientSchema = exports.createClientSchema = void 0;
const zod_1 = require("zod");
exports.createClientSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: zod_1.z.string().email('Invalid email address'),
    company: zod_1.z.string().max(100).optional(),
    phone: zod_1.z.string().max(20).optional(),
    country: zod_1.z.string().max(2).optional(),
});
exports.updateClientSchema = exports.createClientSchema.partial();
//# sourceMappingURL=client.validator.js.map