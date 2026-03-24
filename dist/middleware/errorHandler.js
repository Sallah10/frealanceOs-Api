"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const env_1 = require("../config/env");
const errorHandler = (err, _req, res, _next) => {
    console.error("Error:", err);
    res.status(500).json({
        success: false,
        error: env_1.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map