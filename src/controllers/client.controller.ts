// src/controllers/client.controller.ts
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ClientService } from "../services/client.service";
import { getNumberParam } from "../utils/request-helpers";

const clientService = new ClientService();

// Helper function to safely get string from query/params
const getString = (
  value: string | string[] | undefined,
): string | undefined => {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
};

export class ClientController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const client = await clientService.create(req.userId!, req.body);
      res.status(201).json({
        success: true,
        data: client,
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
      const page = getNumberParam(req.query.page as any, 1)!;
      const pageSize = getNumberParam(req.query.pageSize as any, 10)!;

      const {
        clients,
        total,
        page: currentPage,
        pageSize: currentPageSize,
      } = await clientService.findAll(req.userId!, page, pageSize);

      res.status(200).json({
        success: true,
        data: clients,
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
      const id = getString(req.params.id);
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Invalid client ID",
        });
        return;
      }
      const client = await clientService.findOne(req.userId!, id);
      res.status(200).json({
        success: true,
        data: client,
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
      const id = getString(req.params.id);
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Invalid client ID",
        });
        return;
      }
      const client = await clientService.update(req.userId!, id, req.body);
      res.status(200).json({
        success: true,
        data: client,
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
      const id = getString(req.params.id);
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Invalid client ID",
        });
        return;
      }
      await clientService.delete(req.userId!, id);
      res.status(200).json({
        success: true,
        data: { message: "Client deleted successfully" },
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
