
import { Request, Response } from "express";
import Post from "../model/post";



export const createPost = async (req: Request,res: Response): Promise<void | Response> => {

    try {
        if(!req.user){
             return res.status(401).json({ message: 'user post doesnt exist'});
        }
        const savedPost = await Post.createPost({
            ... req.body,
            authorId: req.user._id.toString()
        });
       res.status(201).json({
        message: 'Post created successfully',
        post: savedPost
       });
    } catch (error) {
       const errorMessage = error instanceof Error? error.message: ' post couldnt created '
        return res.status(400).json({ message: errorMessage});
    }
};

export const getAllPosts = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const result = await Post.getAllPosts({
          page: req.query.page as string,
          limit: req.query.limit as string
        });
       res.status(200).json({
            success: true,
            data: result.posts,
            pagination: result.pagination
        }); 
            
    } catch (error) {
       const errorMessage = error instanceof Error? error.message: 'post couldnt get'
        return res.status(400).json({ message: errorMessage});
    }
};