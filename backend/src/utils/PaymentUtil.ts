import * as crypto from 'crypto';
import axios from 'axios';
import { ethers } from 'ethers';
import { HttpException } from '@/exceptions/HttpException';


export class PaymentUtils {
    static async mainnetUSCTransfer(amount: number, address: string) {
        const addr = await PaymentUtils.getDepositAddress(amount, address);
        if (addr === null) {
            throw new HttpException(500, "Error in getting deposit address");
        }
        await PaymentUtils.USDTTransfer(amount, addr);
        await PaymentUtils.placeUBITBuyOrder(amount);
        await PaymentUtils.withdrawToUser(address, amount);
    }

    static async USDTTransfer(amount: number, address: string): Promise<void> {
        const privateKey = process.env.ESCROW_PRIV_KEY;
        const ubitRpc = process.env.UBIT_TESTNET_RPC;
        const provider = new ethers.providers.JsonRpcProvider(ubitRpc);
        const wallet = new ethers.Wallet(privateKey, provider);

        const usdtContractAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";

        const transferABI = [
            {
                name: "transfer",
                type: "function",
                inputs: [
                    {
                        name: "_to",
                        type: "address",
                    },
                    {
                        type: "uint256",
                        name: "_tokens",
                    },
                ],
                constant: false,
                outputs: [],
                payable: false,
            },
        ];

        const signer = await provider.getSigner();
        const token = new ethers.Contract(usdtContractAddress, transferABI, signer);
        const amountA = BigInt(amount * 10 ** 18);
        await token
            .transfer(address, amountA)
            .then((transferResult: any) => {
                console.log("transferResult", transferResult);
            })
            .catch((error: any) => {
                console.error("Error", error);
            });
    }

    static async withdrawToUser(address: string, amount: number) {
        const url = process.env.WITHDRAW_API;
        const apiKey: string = process.env.COINSTORE_API_KEY;
        const secretKey: string = process.env.COINSTORE_SECRET_KEY;
        const expires: number = Date.now();
        const expiresKey: string = Math.floor(expires / 30000).toString();
        const key: string = crypto.createHmac('sha256', secretKey).update(expiresKey).digest('hex');

        interface Payload {
            currencyCode: string;
            amount: string;
            address: string;
            chainType: string;
        }

        const payload: Payload = {
            currencyCode: "UBIT",
            amount: amount.toString(),
            address: address,
            chainType: "erc20"
        };

        const payloadString: string = JSON.stringify(payload);
        const signature: string = crypto.createHmac('sha256', key).update(payloadString).digest('hex');

        const headers = {
            'X-CS-APIKEY': apiKey,
            'X-CS-SIGN': signature,
            'X-CS-EXPIRES': expires.toString(),
            'Content-Type': 'application/json'
        };

        axios.post(url, payloadString, { headers: headers })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }
    static async getDepositAddress(amount: number, address: string): Promise<string | null> {
        const url = process.env.DEPOSIT_ADDR;
        const apiKey: string = process.env.COINSTORE_API_KEY;
        const secretKey: string = process.env.COINSTORE_SECRET_KEY;
        const expires: number = Date.now();
        const expiresKey: string = Math.floor(expires / 30000).toString();
        const key: string = crypto.createHmac('sha256', secretKey).update(expiresKey).digest('hex');

        interface Payload {
            currencyCode: string;
            chain: string;
        }

        const payload: Payload = {
            currencyCode: "USDTERC20",
            chain: "ERC20"
        };

        const payloadString: string = JSON.stringify(payload);
        const signature: string = crypto.createHmac('sha256', key).update(payloadString).digest('hex');

        const headers = {
            'X-CS-APIKEY': apiKey,
            'X-CS-SIGN': signature,
            'X-CS-EXPIRES': expires.toString(),
            'exch-language': 'en_US',
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Connection': 'keep-alive'
        };
        let addr: null | string = null;

        axios.post(url, payloadString, { headers: headers })
            .then(response => {
                addr = response.data.address
            })
            .catch(error => {
                console.error(error);
            });
        return addr;
    }

    static async placeUBITBuyOrder(amount: number) {
        const url = process.env.ORDER_PLACE;
        const apiKey: string = process.env.COINSTORE_API_KEY;
        const secretKey: string = process.env.COINSTORE_SECRET_KEY;
        const expires: number = Date.now();
        const expiresKey: string = Math.floor(expires / 30000).toString();
        const key: string = crypto.createHmac('sha256', secretKey).update(expiresKey).digest('hex');


        interface Payload {
            ordPrice: string;
            ordQty: string;
            symbol: string;
            side: string;
            ordType: string;
            clOrdId?: string; // Optional field
        }

        const payload: Payload = {
            ordPrice: amount.toString(),
            ordQty: "1",
            symbol: "UBITUSDT",
            side: "BUY",
            ordType: "LIMIT"
        };

        const payloadString: string = JSON.stringify(payload);
        const signature: string = crypto.createHmac('sha256', key).update(payloadString).digest('hex');

        const headers = {
            'X-CS-APIKEY': apiKey,
            'X-CS-SIGN': signature,
            'X-CS-EXPIRES': expires.toString(),
            'exch-language': 'en_US',
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Connection': 'keep-alive'
        };

        axios.post(url, payloadString, { headers: headers })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    static async testnetUSCTransfer(amount: number, address: string): Promise<string> {
        try {
            const privateKey = process.env.ESCROW_PRIV_KEY;
            const ubitRpc = process.env.UBIT_TESTNET_RPC;
            const provider = new ethers.providers.JsonRpcProvider(ubitRpc);
            const wallet = new ethers.Wallet(privateKey, provider);
            const tx = {
                to: address,
                value: BigInt((amount * 10 ** 18)),
                gasLimit: "1000000"
            }
            const transaction = await wallet.sendTransaction(tx);
            const reciept = await transaction.wait();
            console.log(reciept);
            return reciept.transactionHash;
        } catch (error) {
            console.error(error);
            new HttpException(500, "Error in USCTransfer");
        }
    }
}