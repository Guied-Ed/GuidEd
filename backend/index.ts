import express, {Application} from 'express';
import dotenv from 'dotenv'
dotenv.config()
const app:Application = express();
import connectDB from './db/dbConnection';
import userRouter from './routes/userRouter';
import cookieParser from 'cookie-parser'







app.use(express.json());
app.use(cookieParser());
app.use('/api',userRouter);
const port: number = parseInt(process.env.PORT || '3000',10);

app.listen(port, (): void => {
    connectDB();
    console.log(`Listening on port ${port}`);
});

