"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentUtils", {
    enumerable: true,
    get: function() {
        return PaymentUtils;
    }
});
const _crypto = _interop_require_wildcard(require("crypto"));
const _axios = _interop_require_default(require("axios"));
const _ethers = require("ethers");
const _HttpException = require("../exceptions/HttpException");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
let PaymentUtils = class PaymentUtils {
    static async mainnetUSCTransfer(amount, address) {
        const addr = await PaymentUtils.getDepositAddress(amount, address);
        if (addr === null) {
            throw new _HttpException.HttpException(500, "Error in getting deposit address");
        }
        await PaymentUtils.USDTTransfer(amount, addr);
        await PaymentUtils.placeUBITBuyOrder(amount);
        await PaymentUtils.withdrawToUser(address, amount);
    }
    static async USDTTransfer(amount, address) {
        const privateKey = process.env.ESCROW_PRIV_KEY;
        const ubitRpc = process.env.UBIT_TESTNET_RPC;
        const provider = new _ethers.ethers.providers.JsonRpcProvider(ubitRpc);
        const wallet = new _ethers.ethers.Wallet(privateKey, provider);
        const usdtContractAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
        const transferABI = [
            {
                name: "transfer",
                type: "function",
                inputs: [
                    {
                        name: "_to",
                        type: "address"
                    },
                    {
                        type: "uint256",
                        name: "_tokens"
                    }
                ],
                constant: false,
                outputs: [],
                payable: false
            }
        ];
        const signer = await provider.getSigner();
        const token = new _ethers.ethers.Contract(usdtContractAddress, transferABI, signer);
        const amountA = BigInt(amount * 10 ** 18);
        await token.transfer(address, amountA).then((transferResult)=>{
            console.log("transferResult", transferResult);
        }).catch((error)=>{
            console.error("Error", error);
        });
    }
    static async withdrawToUser(address, amount) {
        const url = process.env.WITHDRAW_API;
        const apiKey = process.env.COINSTORE_API_KEY;
        const secretKey = process.env.COINSTORE_SECRET_KEY;
        const expires = Date.now();
        const expiresKey = Math.floor(expires / 30000).toString();
        const key = _crypto.createHmac('sha256', secretKey).update(expiresKey).digest('hex');
        const payload = {
            currencyCode: "UBIT",
            amount: amount.toString(),
            address: address,
            chainType: "erc20"
        };
        const payloadString = JSON.stringify(payload);
        const signature = _crypto.createHmac('sha256', key).update(payloadString).digest('hex');
        const headers = {
            'X-CS-APIKEY': apiKey,
            'X-CS-SIGN': signature,
            'X-CS-EXPIRES': expires.toString(),
            'Content-Type': 'application/json'
        };
        _axios.default.post(url, payloadString, {
            headers: headers
        }).then((response)=>{
            console.log(response.data);
        }).catch((error)=>{
            console.error(error);
        });
    }
    static async getDepositAddress(amount, address) {
        const url = process.env.DEPOSIT_ADDR;
        const apiKey = process.env.COINSTORE_API_KEY;
        const secretKey = process.env.COINSTORE_SECRET_KEY;
        const expires = Date.now();
        const expiresKey = Math.floor(expires / 30000).toString();
        const key = _crypto.createHmac('sha256', secretKey).update(expiresKey).digest('hex');
        const payload = {
            currencyCode: "USDTERC20",
            chain: "ERC20"
        };
        const payloadString = JSON.stringify(payload);
        const signature = _crypto.createHmac('sha256', key).update(payloadString).digest('hex');
        const headers = {
            'X-CS-APIKEY': apiKey,
            'X-CS-SIGN': signature,
            'X-CS-EXPIRES': expires.toString(),
            'exch-language': 'en_US',
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Connection': 'keep-alive'
        };
        let addr = null;
        _axios.default.post(url, payloadString, {
            headers: headers
        }).then((response)=>{
            addr = response.data.address;
        }).catch((error)=>{
            console.error(error);
        });
        return addr;
    }
    static async placeUBITBuyOrder(amount) {
        const url = process.env.ORDER_PLACE;
        const apiKey = process.env.COINSTORE_API_KEY;
        const secretKey = process.env.COINSTORE_SECRET_KEY;
        const expires = Date.now();
        const expiresKey = Math.floor(expires / 30000).toString();
        const key = _crypto.createHmac('sha256', secretKey).update(expiresKey).digest('hex');
        const payload = {
            ordPrice: amount.toString(),
            ordQty: "1",
            symbol: "UBITUSDT",
            side: "BUY",
            ordType: "LIMIT"
        };
        const payloadString = JSON.stringify(payload);
        const signature = _crypto.createHmac('sha256', key).update(payloadString).digest('hex');
        const headers = {
            'X-CS-APIKEY': apiKey,
            'X-CS-SIGN': signature,
            'X-CS-EXPIRES': expires.toString(),
            'exch-language': 'en_US',
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Connection': 'keep-alive'
        };
        _axios.default.post(url, payloadString, {
            headers: headers
        }).then((response)=>{
            console.log(response.data);
        }).catch((error)=>{
            console.error(error);
        });
    }
    static async testnetUSCTransfer(amount, address) {
        try {
            const privateKey = process.env.ESCROW_PRIV_KEY;
            const ubitRpc = process.env.UBIT_TESTNET_RPC;
            const provider = new _ethers.ethers.providers.JsonRpcProvider(ubitRpc);
            const wallet = new _ethers.ethers.Wallet(privateKey, provider);
            const tx = {
                to: address,
                value: BigInt(amount * 10 ** 18),
                gasLimit: "1000000"
            };
            const transaction = await wallet.sendTransaction(tx);
            const reciept = await transaction.wait();
            console.log(reciept);
            return reciept.transactionHash;
        } catch (error) {
            console.error(error);
            new _HttpException.HttpException(500, "Error in USCTransfer");
        }
    }
};
