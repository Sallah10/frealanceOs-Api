"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(req, res) {
        try {
            const { user, token } = await authService.register(req.body);
            res.status(201).json({
                success: true,
                data: { token, user },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                });
            }
            else {
                throw error;
            }
        }
    }
    async login(req, res) {
        try {
            const { user, token } = await authService.login(req.body);
            res.status(200).json({
                success: true,
                data: { token, user },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(401).json({
                    success: false,
                    error: error.message,
                });
            }
            else {
                throw error;
            }
        }
    }
    async getMe(req, res) {
        try {
            const user = await authService.getMe(req.userId);
            res.status(200).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(404).json({
                    success: false,
                    error: error.message,
                });
            }
            else {
                throw error;
            }
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map