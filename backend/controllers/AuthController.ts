import User from '../models/userSchema';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import generateTokenAndSetToken from '../utils/generateTokenAndSetCookie';
import mongoose, { Date } from 'mongoose';
import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSucessfulEmail,
} from '../mails/email';
import crypto from 'crypto';

interface SignUpRequestBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
}

interface SignInReqBody {
    email: string;
    password: string;
}
interface SignInReqBody {
    code: string;
    // verificationTokenExpiresAt:Date;
}
interface ForgotPasswordEmail {
    email: string;
}

interface resetPassord {
    password: string;
}
const signup = async (
    req: Request<{}, {}, SignUpRequestBody>,
    res: Response,
): Promise<any> => {
    const { firstName, lastName, email, password, confirmPassword, role } =
        req.body;
    try {
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            return res
                .status(404)
                .json({ success: false, message: 'All fields are required' });
        }
        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({ success: false, message: 'Passwords do not match' });
        }

        const isUserExists = await User.findOne({ email });
        if (isUserExists) {
            return res
                .status(400)
                .json({ success: false, message: 'User already exists' });
        }

        const hashPassword: string = await bcrypt.hash(password, 10);

        const verificationToken: string = Math.floor(
            100000 + Math.random() * 900000,
        ).toString();
        const hashedToken: string = await bcrypt.hash(verificationToken, 8);

        const userRole =
            role && role === 'instructor' ? 'instructor' : 'student';
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashPassword,
            role: userRole,
            // confirmPassword,
            verificationToken: hashedToken,
            verificationTokenExpiresDate: Date.now() + 24 * 60 * 60 * 1000,
        });

        await user.save();
        const userObject = user.toObject();

        generateTokenAndSetToken(res, user._id.toString());
        await sendVerificationEmail(user.email, verificationToken);
        return res.status(201).json({
            success: true,
            user: {
                ...userObject,
                password: undefined,
            },
        });
    } catch (err: unknown) {
        console.log(err);
        return res.status(500).json({ success: false, message: err });
    }
};

const verifyEmail = async (
    req: Request<{}, {}, SignInReqBody>,
    res: Response,
): Promise<any> => {
    const { code } = req.body;

    try {
        // Find the user based on token and the expiredDate
        const user = await User.findOne({
            // verificationToken: code,
            verificationTokenExpiresDate: { $gte: Date.now() },
        });
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: 'Invalid or exired Token' });

        // Compare the given token provided with the hashed token of the use
        const isMatch = await bcrypt.compare(
            code,
            user.verificationToken || '',
        );

        if (!isMatch)
            return res
                .status(404)
                .json({ success: false, message: 'Invalid or expired Token' });
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresDate = undefined;
        await user.save();

        // Send Welcome email to the user //
        await sendWelcomeEmail(user.email, user.firstName);
        // Convert the respond to object instead of spreading the document
        const userObject = user.toObject();
        res.status(200).json({
            success: true,
            message: 'Email Verified sucessfuly',
            user: {
                ...userObject,
                password: undefined,
            },
        });
    } catch (err: unknown) {
        console.log(err);
        return res.status(500).json({ success: false, message: err });
    }
};

const logout = async (
    req: Request<{}, {}, SignInReqBody>,
    res: Response,
): Promise<any> => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

const login = async (
    req: Request<{}, {}, SignInReqBody>,
    res: Response,
): Promise<any> => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });

        const isPassword = await bcrypt.compare(password, user.password || '');
        if (!isPassword)
            return res
                .status(404)
                .json({ success: false, message: 'Invalid Password' });

        generateTokenAndSetToken(res, user._id.toString());
        user.lastLogin = new Date();
        await user.save();

        const userObject = user.toObject();
        res.status(200).json({
            success: true,
            message: 'Logged In successfully',
            user: {
                ...userObject,
                password: undefined,
            },
        });
    } catch (err: unknown) {
        console.log(err);
        res.status(200).json({ success: false, message: err });
    }
};

const forgotPassword = async (
    req: Request<{}, {}, ForgotPasswordEmail>,
    res: Response,
): Promise<any> => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: 'User Not Found' });

        // Generate a token for the forgot password
        const resetPasswordToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpiresDate = new Date(
            Date.now() + 1 * 60 * 60 * 1000,
        );

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiresDate = resetPasswordExpiresDate;

        await user.save();
        await sendPasswordResetEmail(
            email,
            `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`,
        );
        res.status(200).json({
            success: true,
            message: 'Reset Password email sent successfully',
        });
    } catch (err: unknown) {
        console.log(err);
        res.status(500).json({ message: err });
    }
};

const resetPassword = async (
    req: Request<{ token: string }, {}, resetPassord>,
    res: Response,
): Promise<any> => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresDate: { $gte: Date.now() },
        });
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: 'Invalid / Expired Token' });

        const hashPassword = await bcrypt.hash(password, 10);
        user.password = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresDate = undefined;
        await user.save();
        await sendResetSucessfulEmail(user.email);
        res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        });
    } catch (err: unknown) {
        res.status(500).json({ success: false, message: err });
    }
};

const checkAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById((req as any).userId).select(
            '-password',
        );
        if (!user) {
            res.status(401).json({ success: false, message: 'User NOT found' });
            return;
        }

        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err });
    }
};

export {
    signup,
    verifyEmail,
    logout,
    login,
    forgotPassword,
    resetPassword,
    checkAuth,
};
