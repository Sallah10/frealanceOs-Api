import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ProjectService } from "../services/project.service";
import { getNumberParam, getStringParam } from "../utils/request-helpers";

const projectService = new ProjectService();

export class ProjectController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const project = await projectService.create(req.userId!, req.body);
      res.status(201).json({
        success: true,
        data: project,
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
        projects,
        total,
        page: currentPage,
        pageSize: currentPageSize,
      } = await projectService.findAll(req.userId!, page, pageSize, filters);

      res.status(200).json({
        success: true,
        data: projects,
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
          error: "Invalid project ID",
        });
        return;
      }
      const project = await projectService.findOne(req.userId!, id);
      res.status(200).json({
        success: true,
        data: project,
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
          error: "Invalid project ID",
        });
        return;
      }
      const project = await projectService.update(req.userId!, id, req.body);
      res.status(200).json({
        success: true,
        data: project,
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
          error: "Invalid project ID",
        });
        return;
      }
      await projectService.delete(req.userId!, id);
      res.status(200).json({
        success: true,
        data: { message: "Project deleted successfully" },
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

  async getMilestones(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = getStringParam(req.params.id);
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Invalid project ID",
        });
        return;
      }
      const milestones = await projectService.getMilestones(req.userId!, id);
      res.status(200).json({
        success: true,
        data: milestones,
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
}
