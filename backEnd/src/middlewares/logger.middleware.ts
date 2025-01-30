import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const logRequests = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`[REQUEST] ${req.method} ${req.url} - IP: ${req.ip}`);

    res.on('finish', () => {
        logger.info(`[RESPONSE] ${res.statusCode} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    });

    res.on('error', (err: Error) => {
        logger.error(`[RESPONSE ERROR] ${req.method} ${req.originalUrl} - ${err.message}`);
    });

    next();
};
