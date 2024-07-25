"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TokenSessionMiddleWare", {
    enumerable: true,
    get: function() {
        return TokenSessionMiddleWare;
    }
});
const _jsonwebtoken = require("jsonwebtoken");
const _HttpException = require("../exceptions/HttpException");
const _client = require("@prisma/client");
function getTimeStampFromHeader(req) {
    const timestamp = req.header('X-TXC-TIMESTAMP');
    if (!timestamp) {
        throw new _HttpException.HttpException(400, 'Timestamp header is missing');
    }
    return timestamp;
}
const TokenSessionMiddleWare = async (req, res, next)=>{
    const session = new _client.PrismaClient().session;
    const token = req.header('Access-Token');
    if (!token) next(new _HttpException.HttpException(401, 'Access Token is missing'));
    else {
        const tokenData = token.split(' ')[1];
        try {
            const timestamp = getTimeStampFromHeader(req);
            if (!timestamp) next(new _HttpException.HttpException(400, 'Timestamp header is missing'));
            const secretKey = process.env.SECRET_KEY;
            const verificationResponse = (0, _jsonwebtoken.verify)(tokenData, secretKey);
            const foundSession = await session.findUnique({
                where: {
                    id: verificationResponse.id
                }
            });
            if (!foundSession) next(new _HttpException.HttpException(404, 'Session not found-- Unauthorized'));
            console.log();
            if (Number(timestamp) / 1000 > foundSession.createdAt.getTime() / 1000 + 300) next(new _HttpException.HttpException(401, 'Session Expired timestamp'));
            next();
        } catch (error) {
            next(error);
        }
    }
};
