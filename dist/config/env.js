"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET: zod_1.z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    PORT: zod_1.z.string().transform(Number).default("5000"),
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    FRONTEND_URL: zod_1.z.string().url().default("http://localhost:3000"),
    RATE_LIMIT_WINDOW_MS: zod_1.z.string().transform(Number).default("900000"),
    RATE_LIMIT_MAX_REQUESTS: zod_1.z.string().transform(Number).default("100"),
    RAENEST_API_KEY: zod_1.z.string().optional(),
    RAENEST_API_URL: zod_1.z.string().url().default("https://api.raenest.com/v1"),
});
exports.env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map