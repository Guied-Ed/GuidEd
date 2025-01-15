import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function connectDB(): Promise<void> {
    const url: string | undefined = process.env.mongo_url;
    if (!url) {
        console.log('Please specify a url to connect to');
        return;
    }
    try {
        const db = await mongoose.connect(url);
        console.log(`MongoDB Connected: ${db.connection.host}`);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Error connecting to database' + err.message);
            process.exit(1);
        }
        console.error('An unknown Error Occured ');
        process.exit(1);
    }
}

export default connectDB;
