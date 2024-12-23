import express, { Router } from 'express';
import signup from '../controllers/AuthController';

const router:Router = express.Router();

router.post('/signup',signup)

export default router