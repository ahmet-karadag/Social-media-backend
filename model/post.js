
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

module.exports = mongoose.model('Post', postSchema);