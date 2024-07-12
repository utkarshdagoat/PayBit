import { ExternalApiService } from "@/services/externalApi.service";
import { Request, Response, NextFunction } from "express";
import { SessionDto } from "@/dtos/session.dto";
import { PaymentUtils } from "@/utils/PaymentUtil";

export class ExternalApiController {
    public externalApiService = new ExternalApiService();
    public createSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const sessionData: SessionDto = req.body;
            const [token, session] = await this.externalApiService.creatSession(sessionData);
            console.log(session)
            res.status(201).json({ data: { token }, message: 'Session Created' });
        } catch (error) {
            next(error);
        }
    }
    public getData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const session = await this.externalApiService.getSession(req.body.email);
            res.status(200).json({ data: session, message: 'Session Data' });
        } catch (error) {
            next(error);
        }
    }

    public async transferFundsTestnet(req: Request, res: Response, next: NextFunction) {
        try {
            const session = await this.externalApiService.getSession(req.body.email);
            const amount = session.amount;
            const address = session.walletAddress
            const result = await PaymentUtils.testnetUSCTransfer(amount, address);
            res.status(200).json({ data: result });
        } catch (error) {
            next(error);
        }
    }

    public async transferFundsMainnet(req: Request, res: Response, next: NextFunction) {
        const { amount, address } = req.body;
        try {
            const session = await this.externalApiService.getSession(req.body.email);
            const amount = session.amount;
            const address = session.walletAddress
            const result = await PaymentUtils.mainnetUSCTransfer(amount, address);
            res.status(200).json({ data: result });
        } catch (error) {
            next(error);
        }
    }


    public async getDataFromToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = req.header('Access-Token').split(' ')[1];
            const session = await this.externalApiService.getSessionToken(token);
            const wallet = session.walletAddress;
            const amount = session.amount
            res.status(200).json({ wallet, amount });

        } catch (error) {
            next(error);
        }
    }


}