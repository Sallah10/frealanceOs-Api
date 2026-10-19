import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { MilestoneService } from "../services/milestone.service";
import { getNumberParam, getStringParam } from "../utils/request-helpers";

const milestoneService = new MilestoneService();

export class MilestoneController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const milestone = await milestoneService.create(req.userId!, req.body);
      res.status(201).json({
        success: true,
        data: milestone,
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
      const projectId = getStringParam(req.query.projectId as any);

      if (!projectId) {
        // Allow fetching all milestones when no projectId is provided.
        const {
          milestones,
          total,
          page: currentPage,
          pageSize: currentPageSize,
        } = await milestoneService.findAll(req.userId!, undefined, page, pageSize);

        res.status(200).json({
          success: true,
          data: milestones,
          total,
          page: currentPage,
          pageSize: currentPageSize,
        });
        return;
      }

      const {
        milestones,
        total,
        page: currentPage,
        pageSize: currentPageSize,
      } = await milestoneService.findAll(
        req.userId!,
        projectId,
        page,
        pageSize,
      );

      res.status(200).json({
        success: true,
        data: milestones,
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
          error: "Invalid milestone ID",
        });
        return;
      }
      const milestone = await milestoneService.findOne(req.userId!, id);
      res.status(200).json({
        success: true,
        data: milestone,
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
          error: "Invalid milestone ID",
        });
        return;
      }
      const milestone = await milestoneService.update(
        req.userId!,
        id,
        req.body,
      );
      res.status(200).json({
        success: true,
        data: milestone,
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
          error: "Invalid milestone ID",
        });
        return;
      }
      await milestoneService.delete(req.userId!, id);
      res.status(200).json({
        success: true,
        data: { message: "Milestone deleted successfully" },
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
