"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentRoutes", {
    enumerable: true,
    get: function() {
        return PaymentRoutes;
    }
});
const _express = require("express");
const _paymentcontroller = require("../controllers/payment.controller");
const _authmiddleware = require("../middlewares/auth.middleware");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
let PaymentRoutes = class PaymentRoutes {
    initializeRoutes() {
        this.router.post(`${this.path}testnet`, _authmiddleware.AuthMiddleware, this.payment.transferFundsTestnet);
        this.router.post(`${this.path}mainnet`, _authmiddleware.AuthMiddleware, this.payment.transferFundsMainnet);
    }
    constructor(){
        _define_property(this, "path", '/api/make-payment/');
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "payment", new _paymentcontroller.PaymentController());
        this.initializeRoutes();
    }
};
