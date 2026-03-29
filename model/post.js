
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

    if(!data.title || !data.content){
        throw new Error('title and content are required');
    }
    const newPost = new Post({
        title: data.title,
        content: data.content,
        author: data.authorId // Controller'dan gelen paket içindeki id
    });

    return await newPost.save();
};

module.exports = mongoose.model('Post', postSchema);