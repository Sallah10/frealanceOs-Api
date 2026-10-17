"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaenestService = void 0;
class RaenestService {
    async generatePaymentLink(invoiceId, amount, currency) {
        const paymentLink = `https://pay.raenest.com/freelanceos/${invoiceId}?amount=${amount}&currency=${currency}`;
        await new Promise((resolve) => setTimeout(resolve, 100));
        return paymentLink;
    }
    async handleWebhook(payload) {
        console.log("Raenest webhook received:", payload);
    }
}
exports.RaenestService = RaenestService;
//# sourceMappingURL=raenest.service.js.map