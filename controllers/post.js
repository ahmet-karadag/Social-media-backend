
const Post = require('../model/post');


exports.createPost = async (req,res) => {
    try {
        const savedPost = await Post.createPost({
            ... req.body,
            authorId: req.user.id
        });
       res.status(201).json({
        message: 'Post created successfully',
        post: savedPost
       });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const result = await Post.getAllPosts({
          page: req.query.page,
          limit: req.query.limit
        });
       res.status(200).json({
            success: true,
            data: result.posts,
            pagination: result.pagination
        }); 
            
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};