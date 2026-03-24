"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: 'No token provided',
            });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            res.status(401).json({
                success: false,
                error: 'Invalid or expired token',
            });
            return;
        }
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: 'Authentication failed',
        });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map