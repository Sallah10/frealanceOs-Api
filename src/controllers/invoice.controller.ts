import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { InvoiceService } from "../services/invoice.service";
import { RaenestService } from "../services/raenest.service";
import { getNumberParam, getStringParam } from "../utils/request-helpers";

const invoiceService = new InvoiceService();
const raenestService = new RaenestService();

export class InvoiceController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const invoice = await invoiceService.create(req.userId!, req.body);
      res.status(201).json({
        success: true,
        data: invoice,
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
        invoices,
        total,
        page: currentPage,
        pageSize: currentPageSize,
      } = await invoiceService.findAll(req.userId!, page, pageSize, filters);

      res.status(200).json({
        success: true,
        data: invoices,
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
          error: "Invalid invoice ID",
        });
        return;
      }
      const invoice = await invoiceService.findOne(req.userId!, id);
      res.status(200).json({
        success: true,
        data: invoice,
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
          error: "Invalid invoice ID",
        });
        return;
      }
      const invoice = await invoiceService.update(req.userId!, id, req.body);
      res.status(200).json({
        success: true,
        data: invoice,
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
          error: "Invalid invoice ID",
        });
        return;
      }
      await invoiceService.delete(req.userId!, id);
      res.status(200).json({
        success: true,
        data: { message: "Invoice deleted successfully" },
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
          error: "Invalid invoice ID",
        });
        return;
      }
      const invoice = await invoiceService.markAsSent(req.userId!, id);
      res.status(200).json({
        success: true,
        data: invoice,
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

  async markAsPaid(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = getStringParam(req.params.id);
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Invalid invoice ID",
        });
        return;
      }
      const invoice = await invoiceService.markAsPaid(req.userId!, id);
      res.status(200).json({
        success: true,
        data: invoice,
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

  async generatePaymentLink(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = getStringParam(req.params.id);
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Invalid invoice ID",
        });
        return;
      }
      const invoice = await invoiceService.findOne(req.userId!, id);
      const paymentLink = await raenestService.generatePaymentLink(
        invoice.id,
        invoice.amount,
        invoice.currency,
      );

      res.status(200).json({
        success: true,
        data: { paymentLink },
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
