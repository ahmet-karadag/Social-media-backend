
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
        type: String,
        required: [true,'tit is required'],
        trim: true,
        maxlength: 100
    },
    content: {
        type: String,
        required: [true,'content is required'],
        trim: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},{timestamps: true});

postSchema.statics.createPost = async function(data){
    const Post = this;

    if (!data || typeof data !== 'object') {
        throw new Error('Missing post data');
    }
    const {title,content,authorId} = data;

    if (!title || !content || !authorId) {
        throw new Error('Missing fields: title, content, and authorId are required');
    }
    //mongodb id kontrolü
    if(!mongoose.Types.ObjectId.isValid(authorId)){
        throw new Error('Invalid author ID');
    }

    const postTitle = title.trim();
    const postContent = content.trim();

    if(postTitle.length < 4 || postTitle.length > 100){
        throw new Error('Title must be between 4 and 100 chracters');
    }
    if(postContent.length === 0){
        throw new Error('post content cannot be empty');
    }


    const newPost = new Post({
        title: postTitle,
        content: postContent,
        author: authorId // Controller'dan gelen paket içindeki id
    });

    return await newPost.save();
};

postSchema.statics.getAllPosts = async function(options = {}){
    const Post = this;

    const page = Math.max(1, parseInt(options.page) || 1);
    const limit = Math.max(1,parseInt(options.limit) || 10);
    const skip = (page - 1) * limit;

    const posts = await Post.find()
    .populate('author', 'username email')
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit)

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    return {
        posts,
        pagination: {
            totalPosts,
            totalPages,
            currentPage: page,
            limit
        }
    };

};

module.exports = mongoose.model('Post', postSchema);