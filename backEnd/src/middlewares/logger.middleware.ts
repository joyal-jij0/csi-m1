import { Request, Response, NextFunction } from 'express';
import { ApiTrafficLogger } from '../utils/logger';

export const logRequests = (req: Request, res: Response, next: NextFunction) => {
    ApiTrafficLogger.info(`[REQUEST] ${req.method} ${req.url} - IP: ${req.ip}`);

    res.on('finish', () => {
        ApiTrafficLogger.info(`[RESPONSE] ${res.statusCode} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    });

    res.on('error', (err: Error) => {
        ApiTrafficLogger.error(`[RESPONSE ERROR] ${req.method} ${req.originalUrl} - ${err.message}`);
    });

    next();
};
