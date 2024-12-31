import express, { Router } from 'express';
import {signup,verifyEmail,logout,login,forgotPassword,resetPassword} from '../controllers/AuthController';

const router:Router = express.Router();

router.post('/signup',signup);
router.post('/verify-email',verifyEmail);
router.post('/logout',logout);
router.post('/login',login)
router.post('/forgot-password',forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router