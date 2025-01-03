import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    userId: string;
    role: string;
}



// Extending the Request interface to include userId
export interface CustomRequest extends Request {
  userId?: string; // Optional, assuming userId might be undefined if not authenticated
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = (req as any).cookies?.token;
    if (!token) {
        res.status(404).json({ success: false, message: "Unauthorized User -- No token provided" });
        return; 
    }

    // Confirm JWT_SECRET before verifying the token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500).json({ success: false, message: "Incorrect secret in env file" });
        return; 
    }

    try {
        const decoded = jwt.verify(token, secret) as DecodedToken;
        (req as any).userId = decoded.userId; 
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Unauthorized User -- Invalid Token" });
        return; // Ensure the function ends here
    }
};

export default verifyToken;