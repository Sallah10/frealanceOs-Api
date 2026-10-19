// src/routes/index.ts
import { Router } from "express";
import authRoutes from "./auth";
import clientRoutes from "./clients";
import projectRoutes from "./projects";
import milestoneRoutes from "./milestones";
import invoiceRoutes from "./invoices";
import proposalRoutes from "./proposals";
import dashboardRoutes from "./dashboard";
import notificationRoutes from "./notifications";

const router = Router();

router.use("/auth", authRoutes);
router.use("/clients", clientRoutes);
router.use("/projects", projectRoutes);
router.use("/milestones", milestoneRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/proposals", proposalRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/notifications", notificationRoutes);

export default router;
