import { Request, Response, NextFunction } from 'express';
import User from '../models/userSchema';


const isInstructor = async (req: Request, res: Response, next: NextFunction) => {

  const userId = (req as any).userId;
  if (!userId) {
    res.status(401).json({ message: 'User is not authenticated' })
    return;
  }

  // Fetch the user from the database based on the userId
  const user = await User.findById(userId);
  if (user?.role !== 'instructor') {
    res.status(403).json({ message: 'Only instructors can create courses' })
    return;
  }

  next();
}

export default isInstructor;