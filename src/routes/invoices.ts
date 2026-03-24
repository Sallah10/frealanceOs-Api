// src/routes/invoices.ts
import { Router } from 'express';
import { InvoiceController } from '../controllers/invoice.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createInvoiceSchema, updateInvoiceSchema } from '../validators/invoice.validator';

const router = Router();
const invoiceController = new InvoiceController();

router.use(authenticate);

router.get('/', invoiceController.findAll);
router.get('/:id', invoiceController.findOne);
router.post('/', validate(createInvoiceSchema), invoiceController.create);
router.put('/:id', validate(updateInvoiceSchema), invoiceController.update);
router.delete('/:id', invoiceController.delete);
router.post('/:id/send', invoiceController.send);
router.post('/:id/mark-paid', invoiceController.markAsPaid);
router.post('/:id/payment-link', invoiceController.generatePaymentLink);

export default router;