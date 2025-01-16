// controllers/courseController.ts

import { Request, Response } from 'express';
import { uploadToCloudinary } from '../middleware/multerMiddleWare';
import Course from '../models/courseSchema';

interface multerFile {
  buffer: Buffer;
  originalName: string
}

 export interface CustomRequest extends Request {
  userId?: string;
  files?: { [fieldname: string]: Express.Multer.File[] } | undefined;
  body: {
    tittle: string;
    description: string;
    duration: number;
    category: string;
    price: number;
    level: string;
  }
}

type Video = {
  tittle: string;
  videoFilePath: string;
  duration?: number;
  description?: string;
};

const uploadFilesAndCreateCourse = async (req: CustomRequest, res: Response) => {
  const { thumbnail, videos } = req.files || {};
  const { tittle, description, duration, category, price, level } = req.body;

  if (!thumbnail || thumbnail.length === 0 || !videos || videos.length === 0) {
    res.status(400).json({ error: 'Thumbnail and videos are required' });
    return;
  }

  console.log('Files:', req.files);


  console.log('Uploading Thumbnail:', { buffer: thumbnail[0].buffer, folder: 'guided/thumbnails', type: 'image' });
  console.log('Uploading Video:', { buffer: videos[0].buffer, folder: 'guided/videos', type: 'video' });
  

  try {
    const thumbnailUpload = await uploadToCloudinary(
      thumbnail[0].buffer,
      'guided/thumbnails',
      'image'
    );

    const videoData: Video[] = await Promise.all(
      videos.map(async (v) => {
        const videoUpload = await uploadToCloudinary(
          v.buffer,
          'guided/videos',
          'video'
        );

        return {
          tittle: v.originalname, // Using the original file name as the title
          videoFilePath: videoUpload.secure_url, // Cloudinary URL
          duration: undefined, // Optional field, set as needed
          description: undefined, // Optional field, set as needed
        };
      })
    );

    const newCourse = new Course({
      tittle,
      description,
      duration,
      category,
      price,
      level,
      thumbnail: thumbnailUpload.secure_url,
      videos: videoData, // Store video data in the appropriate format
    });

    await newCourse.save();

    // Respond with success message and the created course
    res.status(201).json({
      message: 'Course created successfully!',
      course: newCourse,
    });
  } catch (error) {
    console.error('Error uploading files and creating course:', error);
    console.log(error)
    res.status(500).json({ error: 'File upload or course creation failed' });
  }
};

export { uploadFilesAndCreateCourse };
