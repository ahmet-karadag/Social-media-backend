
import mongoose,{Document,Model,Schema} from "mongoose";

export interface IPost extends Document {
    author: mongoose.Types.ObjectId;
    title: string;
    content: string;
    likes: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

interface ICreatePostInput{
    title: string;
    content: string;
    authorId: string;
    [key: string]: unknown;
}
// getAllPosts fonksiyonuna gelecek sayfalama seçeneklerim
interface IGetAllPostOptions {
    page?: string | number ;
   limit?: string | number;
}
interface IGetAllPostResult {
    posts: IPost[];
    pagination: {
            totalPosts: number;
            totalPages: number;
            currentPage: number;
            limit:number;
        }
}
interface IPostModel extends Model<IPost> {
    createPost(data: ICreatePostInput): Promise<IPost>;
    getAllPosts(options?: IGetAllPostOptions): Promise<IGetAllPostResult>;
} 

const postSchema = new mongoose.Schema<IPost,IPostModel>({
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

postSchema.statics.createPost = async function(data: ICreatePostInput): Promise<IPost>{
    const Post = this as IPostModel;

    if (!data || typeof data !== 'object') {
        throw new Error('Missing post data');
    }
    const {title,content,authorId} = data;

    if (typeof !title !== 'string'  || typeof content !== 'string' || typeof authorId !== 'string') {
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

postSchema.statics.getAllPosts = async function(options: IGetAllPostOptions = {}): Promise<IGetAllPostResult>{
    const Post = this as IPostModel;

    const page = Math.max(1,typeof options.page === 'string' ? parseInt(options.page,10): options.page || 1);
    const limit = Math.max(1, typeof options.limit === 'string' ? parseInt(options.limit, 10) : options.limit || 1);
    //const limit = Math.max(1,parseInt(options.limit ) || 10);
    const skip = (page - 1) * limit;

    const posts = await Post.find()
    .populate('author', 'username email')
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit);

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

const Post = mongoose.model<IPost,IPostModel>('Post', postSchema);
export default Post;