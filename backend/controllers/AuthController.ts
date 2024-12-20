import User from "../models/userSchema";
import Course from "../models/courseSchema";
import { Request, Response } from "express";

interface SignUpRequestBody{
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    confirmPassword:string
}

const signup = async (req:Request<{},{}, SignUpRequestBody>,res:Response):Promise<Response> =>{


    const {firstName,lastName, email, password, confirmPassword} = req.body;
    try{
        if(!firstName || !lastName || !email || !password || !confirmPassword){
            return res.status(404).json({success:false, message:"All fieds are required"})
        }
        return res.status(201).json({ success: true, message: "Signup successful!" });
    }catch(err){
        return res.status(500).json({ success: false, message: "Internal server error" });
    }


}