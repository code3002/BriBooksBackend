import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserProfile(req.user!.userId);
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};
