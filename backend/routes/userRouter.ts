import express, { Router } from 'express';
import {signup,verifyEmail,logout,login,forgotPassword,resetPassword,checkAuth} from '../controllers/AuthController';
import verifyToken from '../middleware/verifyToken';

const router:Router = express.Router();
router.get('/check-auth',verifyToken,checkAuth)
router.post('/signup',signup);
router.post('/verify-email',verifyEmail);
router.post('/logout',logout);
router.post('/login',login)
router.post('/forgot-password',forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router