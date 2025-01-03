import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../cloudinary.config';



const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const isVideo = file.mimetype.startsWith('video');
  
      return {
        folder: 'courses',
        resource_type: isVideo ? 'video' : 'image', 
        format: file.mimetype.split('/')[1], 
        transformation: !isVideo
          ? [{ width: 500, height: 500, crop: 'limit', quality: 'auto' }]
          : undefined
      };
    },
  });

  const upload = multer({storage})

  export default upload;