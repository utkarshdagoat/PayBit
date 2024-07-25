"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StripeController", {
    enumerable: true,
    get: function() {
        return StripeController;
    }
});
const _client = require("@prisma/client");
const _stripe = _interop_require_default(require("stripe"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let StripeController = class StripeController {
    constructor(){
        _define_property(this, "kyc", new _client.PrismaClient().kYC);
        _define_property(this, "transaction", new _client.PrismaClient().transaction);
        _define_property(this, "stripe", new _stripe.default(process.env.STRIPE_SECRET_KEY));
        _define_property(this, "OnrampSessionResource", _stripe.default.StripeResource.extend({
            create: _stripe.default.StripeResource.method({
                method: 'POST',
                path: 'crypto/onramp_sessions'
            })
        }));
        _define_property(this, "createPaymentIntent", async (req, res, next)=>{
            const { amount, walletAddress } = req.body;
            console.log(amount);
            try {
                const kyc = await this.kyc.findUnique({
                    where: {
                        userId: req.user.id
                    }
                });
                if (kyc.status !== _client.kycStatus.APPROVED) {
                    res.status(401).send('User KYC is not approved');
                    throw Error;
                }
                const customer = await this.stripe.customers.create({
                    name: `${kyc.firstName} ${kyc.lastName}`,
                    address: {
                        line1: kyc.address,
                        postal_code: kyc.postalCode,
                        city: kyc.city,
                        state: kyc.state,
                        country: 'US'
                    }
                });
                const AmountInCents = amount * 100;
                const paymentIntent = await this.stripe.paymentIntents.create({
                    amount: AmountInCents,
                    currency: 'usd',
                    description: 'Software development services',
                    customer: customer.id
                });
                if (paymentIntent) {
                    const transaction = await this.transaction.create({
                        data: {
                            userId: req.user.id,
                            amount: amount,
                            walletAddress
                        }
                    });
                }
                res.send({
                    clientSecret: paymentIntent.client_secret
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "createExternalAPIPaymentIntent", async (req, res, next)=>{
            const { userData, amount } = req.body;
            try {
                const customer = await this.stripe.customers.create({
                    name: `${userData.firstName} ${userData.lastName}`,
                    address: {
                        line1: userData.address,
                        postal_code: userData.postalCode,
                        city: userData.city,
                        state: userData.state,
                        country: 'US'
                    }
                });
                const AmountInCents = amount * 100;
                const paymentIntent = await this.stripe.paymentIntents.create({
                    amount: AmountInCents,
                    currency: 'usd',
                    description: 'Software development services',
                    customer: customer.id
                });
                res.send({
                    clientSecret: paymentIntent.client_secret
                });
            } catch (error) {
                next(error);
            }
        });
    }
};
