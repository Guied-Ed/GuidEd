import express, { Application } from "express";
import dotenv from "dotenv";
dotenv.config();
const app: Application = express();
import connectDB from "./db/dbConnection";
import userRouter from "./routes/userRouter";
import cookieParser from "cookie-parser";
import courseRouter from "./routes/courseRouter";
import cartRouter from "./routes/cartRouter";

app.use(express.json());
app.use(cookieParser());
app.use("/api/", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/cart", cartRouter);
const port: number = parseInt(process.env.PORT || "3000", 10);


app.listen(port, (): void => {
  connectDB();
  console.log(`Listening on port ${port}`);

app.listen(3000, (): void => {
    connectDB();
    console.log(`Listening on port ${port}`);

});
