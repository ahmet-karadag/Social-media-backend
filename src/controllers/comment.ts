
  import { Request,Response } from 'express';
  import Comment from '../model/comment';
  import {IUserDocument} from '../model/user'

  interface AuthenticatedRequest extends Request {
    user?: IUserDocument;

    params: {
      postId: string;
      [key: string]: string;
    }
  }

  export const createComment = async(req:AuthenticatedRequest,res: Response):Promise<void | Response> =>{
    try {
      if(!req.user){
        return res.status(401).json({ message: 'user comment doesnt exist'});
      }

      const savedComment = await Comment.createComment({
        authorId: req.user._id.toString(),
        postId: req.body.postId,
        content: req.body.content
      });

      res.status(201).json({
        success: true,
        message: 'Comment created successfully',
        comment: savedComment
      });

    } catch (error) {
      const errorMessage = error instanceof Error? error.message: 'Comment couldnt be created';
      return res.status(400).json({ message: errorMessage});
    }
  };

  export const getCommentsByPost = async(req: AuthenticatedRequest,res:Response): Promise<void | Response> => {
    try {
      const result = await Comment.getCommentsByPost(req.params.postId,{
    
        page: req.query.page as string,
        limit: req.query.limit as string
      });

      res.status(200).json({
        success: true,
        data: result.comments,
        pagination: result.pagination
      });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'comments couldnt get';
        return res.status(400).json({ message: errorMessage });
    }
  };