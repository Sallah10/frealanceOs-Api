"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const clients_1 = __importDefault(require("./clients"));
const projects_1 = __importDefault(require("./projects"));
const milestones_1 = __importDefault(require("./milestones"));
const invoices_1 = __importDefault(require("./invoices"));
const proposals_1 = __importDefault(require("./proposals"));
const dashboard_1 = __importDefault(require("./dashboard"));
const router = (0, express_1.Router)();
router.use("/auth", auth_1.default);
router.use("/clients", clients_1.default);
router.use("/projects", projects_1.default);
router.use("/milestones", milestones_1.default);
router.use("/invoices", invoices_1.default);
router.use("/proposals", proposals_1.default);
router.use("/dashboard", dashboard_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map