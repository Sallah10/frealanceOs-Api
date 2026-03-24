import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ProposalService } from "../services/proposal.service";
import { getNumberParam, getStringParam } from "../utils/request-helpers";

const proposalService = new ProposalService();

export class ProposalController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const proposal = await proposalService.create(req.userId!, req.body);
      res.status(201).json({
        success: true,
        data: proposal,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        throw error;
      }
    }
  }

  async findAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = getNumberParam(req.query.page as any, 1);
      const pageSize = getNumberParam(req.query.pageSize as any, 10);
      const filters = {
        status: getStringParam(req.query.status as any),
        clientId: getStringParam(req.query.clientId as any),
      };

      const {
        proposals,
        total,
        page: currentPage,
        pageSize: currentPageSize,
      } = await proposalService.findAll(req.userId!, page, pageSize, filters);

      res.status(200).json({
        success: true,
        data: proposals,
        total,
        page: currentPage,
        pageSize: currentPageSize,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        throw error;
      }
    }
  }

  async findOne(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = getStringParam(req.params.id);
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Invalid proposal ID",
        });
        return;
      }
      const proposal = await proposalService.findOne(req.userId!, id);
      res.status(200).json({
        success: true,
        data: proposal,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        throw error;
      }
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = getStringParam(req.params.id);
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Invalid proposal ID",
        });
        return;
      }
      const proposal = await proposalService.update(req.userId!, id, req.body);
      res.status(200).json({
        success: true,
        data: proposal,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        throw error;
      }
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = getStringParam(req.params.id);
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Invalid proposal ID",
        });
        return;
      }
      await proposalService.delete(req.userId!, id);
      res.status(200).json({
        success: true,
        data: { message: "Proposal deleted successfully" },
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        throw error;
      }
    }
  }

  async send(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = getStringParam(req.params.id);
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Invalid proposal ID",
        });
        return;
      }
      const proposal = await proposalService.send(req.userId!, id);
      res.status(200).json({
        success: true,
        data: proposal,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        throw error;
      }
    }
  }

  async accept(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = getStringParam(req.params.id);
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Invalid proposal ID",
        });
        return;
      }
      const proposal = await proposalService.accept(req.userId!, id);
      res.status(200).json({
        success: true,
        data: proposal,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        throw error;
      }
    }
  }

  async reject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = getStringParam(req.params.id);
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Invalid proposal ID",
        });
        return;
      }
      const proposal = await proposalService.reject(req.userId!, id);
      res.status(200).json({
        success: true,
        data: proposal,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        throw error;
      }
    }
  }
}
