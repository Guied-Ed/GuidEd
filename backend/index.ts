import express, { Application } from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app: Application = express();
import connectDB from './db/dbConnection';
import userRouter from './routes/userRouter';
import cookieParser from 'cookie-parser';
import courseRouter from './routes/courseRouter';
import os from 'node:os';

app.use(express.json());
app.use(cookieParser());
app.use('/api', userRouter);
app.use('/api/course', courseRouter);

const port: number = parseInt(process.env.PORT || '3000', 10);
const networkAddress = (): string | null => {
    const interfaces = os.networkInterfaces();

    for (const interfaceName in interfaces) {
        const interfaceInfo = interfaces[interfaceName];
        if (interfaceInfo) {
            for (const info of interfaceInfo) {
                if (info.family === 'IPv4' && !info.internal) {
                    return info.address;
                }
            }
        }
    }
    return null;
};

const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

app.listen(port, async (): Promise<void> => {
    await connectDB();
    console.log(
        `App is running, visit ${protocol}://${networkAddress()}:${port}`,
    );
});
