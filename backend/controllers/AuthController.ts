import User from "../models/userSchema";
import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcryptjs'; 
import generateTokenAndSetToken from "../utils/generateTokenAndSetCookie";
import mongoose from "mongoose"; 
import { sendVerificationEmail,sendWelcomeEmail } from "../mails/email";


interface SignUpRequestBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}
interface SignInReqBody{
    code:string,
    // verificationTokenExpiresAt:Date;
}

const signup = async (req: Request<{}, {}, SignUpRequestBody>, res: Response):Promise<any> => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    try {
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(404).json({ success: false, message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        const isUserExists = await User.findOne({ email });
        if (isUserExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }


        const hashPassword: string = await bcrypt.hash(password, 10);

        const verificationToken: string = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashPassword,
            // confirmPassword,
            verificationToken,
            verificationTokenExpiresDate: Date.now() + 24 * 60 * 60 * 1000 
        });

     
        await user.save();
        const userObject = user.toObject(); 
    
        generateTokenAndSetToken(res, user._id.toString());
        await sendVerificationEmail(user.email,verificationToken);
        return res.status(201).json({ success: true, user:{
            ...userObject,
            password:undefined

        }});

    } catch (err:unknown) {
        console.log(err);
        return res.status(500).json({ success: false, message: err });
    }
};

const verifyEmail = async(req:Request<{}, {},SignInReqBody>, res:Response):Promise<any> =>{
    const {code}= req.body;
    try{
        const user = await User.findOne({
            verificationToken:code,
            verificationTokenExpiresDate:{$gte:Date.now()}
        });
        if(!user) return res.status(404).json({ success: false, message: "Invalid or exired Token"});

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresDate = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.firstName);
        const userObject = user.toObject(); 
        res.status(200).json({success:true, message:"Email Verified sucessfuly", user:{
            ...userObject, 
            password:undefined
        }})

    }catch(err:unknown){
        console.log(err);
        return res.status(500).json({ success: false, message: err });
    }
}


export {signup, verifyEmail};