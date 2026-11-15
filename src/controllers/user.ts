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

  export const uploadProfilePicture = async(req: Request, res: Response): Promise<void> => {
    try {
      if(!req.file){
        res.status(400).json({ success: false, message: 'No image file provided!' });
        return;
      }
      
      const userId = req.user?._id ? String(req.user._id): undefined;

      if(!userId){
        res.status(401).json({ success: false, message: 'Unauthorized: User ID not found!' });
        return;
      }

      const profilePictureUrl = await User.saveProfilePicture({
        userId,
        file: req.file
      });

      res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully!',
      data: {
        profilePictureUrl
      }
    });
    }catch(error){
      const errorMessage = error instanceof Error ? error.message : 'Server error';
      res.status(500).json({ success: false, message: errorMessage });
    }
  }