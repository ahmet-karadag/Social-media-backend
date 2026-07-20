
  import { Request,Response } from 'express';
  import Like from '../model/likes';
  import Post from '../model/post';
  import { IUserDocument } from '../model/user';
  import mongoose from 'mongoose'; 

  //add and remove likes function
  export const toggleLike = async(req: Request, res: Response): Promise <void | Response> =>{
    
    try {
      if(!req.user){
        return res.status(401).json({ message: 'you should login for get likes' });
      }
      
      const { postId } = req.params as {postId: string};

      if(!mongoose.Types.ObjectId.isValid(postId)){
        return res.status(400).json({ message: 'invalid post Id' });  
      }

      const userId = req.user._id;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
       return res.status(401).json({ message: 'Invalid user session' });
      } 
      
      const result = await Post.toggleLike(postId, userId);

      return res.status(200).json({
      success: true,
      message: result.message,
      likesCount: result.post.likesCount
    });      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'like failed';
      return res.status(500).json({ message: errorMessage });  
    }
  } 