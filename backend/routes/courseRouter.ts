// routes/courseRouter.ts
import express, { Router } from "express";
import upload from "../utils/config/multer";
import createCourse from "../controllers/courseController";
import verifyToken from "../middleware/verifyToken";
import isInstructor from "../middleware/roleMiddleWare";
const router: Router = express.Router();

router.post(
  '/upload-course',
  verifyToken, // Middleware to verify the token and add userId to req
  upload.fields([
    { name: 'thumbnail', maxCount: 1 }, // Single thumbnail file
    { name: 'videos', maxCount: 5 },     // Multiple video files (up to 5)
  ]),
  isInstructor,
  createCourse // Controller to create the course
);

export default router;
