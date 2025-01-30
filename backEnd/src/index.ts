import 'dotenv/config'
import { PrismaClient } from '@prisma/client';
import {app, server} from './app'
import { logger } from './utils/logger';

const port = process.env.PORT;

export const prisma = new PrismaClient()

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    logger.info(`Server is running on PORT ${port}`);
});
