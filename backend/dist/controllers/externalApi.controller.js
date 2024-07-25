"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExternalApiController", {
    enumerable: true,
    get: function() {
        return ExternalApiController;
    }
});
const _externalApiservice = require("../services/externalApi.service");
const _PaymentUtil = require("../utils/PaymentUtil");
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
let ExternalApiController = class ExternalApiController {
    async transferFundsTestnet(req, res, next) {
        try {
            const session = await this.externalApiService.getSession(req.body.email);
            const amount = session.amount;
            const address = session.walletAddress;
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
            const session = await this.externalApiService.getSession(req.body.email);
            const amount = session.amount;
            const address = session.walletAddress;
            const result = await _PaymentUtil.PaymentUtils.mainnetUSCTransfer(amount, address);
            res.status(200).json({
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
    async getDataFromToken(req, res, next) {
        try {
            const token = req.header('Access-Token').split(' ')[1];
            const session = await this.externalApiService.getSessionToken(token);
            const wallet = session.walletAddress;
            const amount = session.amount;
            res.status(200).json({
                wallet,
                amount
            });
        } catch (error) {
            next(error);
        }
    }
    constructor(){
        _define_property(this, "externalApiService", new _externalApiservice.ExternalApiService());
        _define_property(this, "createSession", async (req, res, next)=>{
            try {
                const sessionData = req.body;
                const [token, session] = await this.externalApiService.creatSession(sessionData);
                console.log(session);
                res.status(201).json({
                    data: {
                        token
                    },
                    message: 'Session Created'
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getData", async (req, res, next)=>{
            try {
                const session = await this.externalApiService.getSession(req.body.email);
                res.status(200).json({
                    data: session,
                    message: 'Session Data'
                });
            } catch (error) {
                next(error);
            }
        });
    }
};
