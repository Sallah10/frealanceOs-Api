"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_controller_1 = require("../controllers/client.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const client_validator_1 = require("../validators/client.validator");
const router = (0, express_1.Router)();
const clientController = new client_controller_1.ClientController();
router.use(auth_1.authenticate);
router.get('/', clientController.findAll);
router.get('/:id', clientController.findOne);
router.post('/', (0, validation_1.validate)(client_validator_1.createClientSchema), clientController.create);
router.put('/:id', (0, validation_1.validate)(client_validator_1.updateClientSchema), clientController.update);
router.delete('/:id', clientController.delete);
exports.default = router;
//# sourceMappingURL=clients.js.map