"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
router.post('/register', (0, validation_1.validate)(auth_validator_1.registerSchema), authController.register);
router.post('/login', (0, validation_1.validate)(auth_validator_1.loginSchema), authController.login);
router.get('/me', auth_1.authenticate, authController.getMe);
exports.default = router;
//# sourceMappingURL=auth.js.map