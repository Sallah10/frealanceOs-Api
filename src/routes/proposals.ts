// src/routes/proposals.ts
import { Router } from "express";
import { ProposalController } from "../controllers/proposal.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validation";
import {
  createProposalSchema,
  updateProposalSchema,
} from "../validators/proposal.validator";

const router = Router();
const proposalController = new ProposalController();

router.use(authenticate);

router.get("/", proposalController.findAll);
router.get("/:id", proposalController.findOne);
router.post("/", validate(createProposalSchema), proposalController.create);
router.put("/:id", validate(updateProposalSchema), proposalController.update);
router.delete("/:id", proposalController.delete);
router.post("/:id/send", proposalController.send);
router.post("/:id/accept", proposalController.accept);
router.post("/:id/reject", proposalController.reject);

export default router;
