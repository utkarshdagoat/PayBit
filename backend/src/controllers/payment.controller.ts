import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { PaymentUtils } from '@/utils/PaymentUtil';
export class PaymentController {


    public async transferFundsTestnet(req: RequestWithUser, res: Response, next: NextFunction) {
        const { amount, address } = req.body;
        try {
            const result = await PaymentUtils.testnetUSCTransfer(amount, address);
            res.status(200).json({ data: result });
        } catch (error) {
            next(error);
        }
    }

    public async transferFundsMainnet(req: RequestWithUser, res: Response, next: NextFunction) {
        const { amount, address } = req.body;
        try {
            const result = await PaymentUtils.mainnetUSCTransfer(amount, address);
            res.status(200).json({ data: result });
        } catch (error) {
            next(error);
        }
    }


    
}
