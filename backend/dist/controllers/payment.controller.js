"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentController", {
    enumerable: true,
    get: function() {
        return PaymentController;
    }
});
const _PaymentUtil = require("../utils/PaymentUtil");
let PaymentController = class PaymentController {
    async transferFundsTestnet(req, res, next) {
        const { amount, address } = req.body;
        try {
            const result = await _PaymentUtil.PaymentUtils.testnetUSCTransfer(amount, address);
            res.status(200).json({
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
    async transferFundsMainnet(req, res, next) {
        const { amount, address } = req.body;
        try {
            const result = await _PaymentUtil.PaymentUtils.mainnetUSCTransfer(amount, address);
            res.status(200).json({
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
};
