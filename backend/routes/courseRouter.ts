// routes/courseRoutes.ts

import express, { Router } from 'express';
import { upload } from '../middleware/multerMiddleWare'; // Import the upload middleware
import verifyToken from '../middleware/verifyToken';
import isInstructor from '../middleware/roleMiddleWare';
import { uploadFilesAndCreateCourse } from '../controllers/courseController';
import { CustomRequest } from '../controllers/courseController';
const router: Router = express.Router();

// Add the upload middleware for handling files (thumbnail, videos)
router.post(
    '/upload-course',
    // verifyToken, // Middleware to verify the token and add userId to req
    // isInstructor,
    upload.fields([
        { name: 'thumbnail', maxCount: 1 }, // Expect a single thumbnail file
        { name: 'videos', maxCount: 5 }, // Expect multiple videos, adjust maxCount as needed
    ]),
    (req, res) => uploadFilesAndCreateCourse(req as CustomRequest, res), // Type assertion here
);

export default router;
