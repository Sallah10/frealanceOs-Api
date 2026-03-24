"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const rateLimiter_1 = require("./middleware/rateLimiter");
const errorHandler_1 = require("./middleware/errorHandler");
const routes_1 = __importDefault(require("./routes"));
exports.app = (0, express_1.default)();
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200,
}));
exports.app.use(rateLimiter_1.limiter);
exports.app.use(express_1.default.json({ limit: "10mb" }));
exports.app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
exports.app.get("/api/v1/health", (_req, res) => {
    res.status(200).json({
        success: true,
        data: {
            status: "ok",
            timestamp: new Date().toISOString(),
            environment: env_1.env.NODE_ENV,
        },
    });
});
exports.app.use("/api/v1", routes_1.default);
exports.app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.method} ${req.path} not found`,
    });
});
exports.app.use(errorHandler_1.errorHandler);
//# sourceMappingURL=server.js.map