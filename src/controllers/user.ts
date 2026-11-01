import { Request, Response } from 'express';
import User from '../model/user';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.getUserProfile({ userId: (req as any).user._id });
    res.status(200).json({ success: true, user });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Profil alınamadı';
    res.status(400).json({ success: false, message: errorMessage });
  }
};