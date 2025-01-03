// controllers/courseController.ts

import { Response } from 'express';
import mongoose from 'mongoose';
import Course from '../models/courseSchema'; // Assuming the Course model is defined in this file
import { CustomRequest } from '../middleware/verifyToken'; // Import CustomRequest type

type Video = {
  tittle: string;
  videoFilePath: string;
  duration?: number;
  description?: string;
};

interface CourseRequestBody {
  tittle: string;
  description: string;
  duration: number;
  category: string;
  price: number;
  level: string;
  thumbnail: string;
  videos: Video[];
}

const createCourse = async (req: CustomRequest, res: Response): Promise<any> => {
    const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ success: false, message: "User is not authenticated" });
   
  }

  const { tittle, description, duration, category, price, level, videos,thumbnail } = req.body as CourseRequestBody;

  if (!tittle || !description || !category || !price || !level || !videos || !thumbnail) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  
  }

  try {
    if (!req.files || !('thumbnail' in req.files)) {
      return res.status(400).json({ success: false, message: 'Thumbnail is required' });
     
    }

    if (!req.files?.videos || req.files.videos.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one video is required' });
     
    }

    const thumbnailPath = req.files.thumbnail[0].path; // Cloudinary URL for the thumbnail
    const videoFiles = req.files.videos.map((file: any) => ({
      tittle: file.originalname,
      videoFilePath: file.path, // Cloudinary URL for each video
    }));

    const newCourse = new Course({
      tittle,
      description,
      instructor: userId,
      duration,
      category,
      price,
      level,
      thumbnail: thumbnailPath,
      videos: videoFiles,
    });

    const savedCourse = await newCourse.save();

    return res.status(201).json({ success: true, course: savedCourse });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to create course" });
  }
};

export default createCourse;
