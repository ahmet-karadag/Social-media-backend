
  import mongoose,{Document,Model,Schema} from 'mongoose';
  import Like from './likes';
import { promises } from 'node:dns';

  export interface IPost extends Document {
    author: mongoose.Types.ObjectId;
    title: string;
    content: string;
    likesCount: number;
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
    toggleLike(postId: string, userId: mongoose.Types.ObjectId): Promise<{ post: IPost; message: string }>;
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
    likesCount: {
      type: Number,
      default: 0
    }
  },{timestamps: true});

  postSchema.statics.createPost = async function(data: ICreatePostInput): Promise<IPost>{
    const Post = this as IPostModel;

    if (!data || typeof data !== 'object') {
      throw new Error('Missing post data');
    }

    const {title,content,authorId} = data;

    if (typeof title !== 'string'  || typeof content !== 'string' || typeof authorId !== 'string') {
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
    try {
      return await newPost.save();
    } catch (error) {
      const errorMessage = error instanceof Error? error.message: 'Post couldnt be saved error';
      throw new Error(errorMessage);
    } 
  };

  postSchema.statics.getAllPosts = async function(options: IGetAllPostOptions = {}): Promise<IGetAllPostResult>{
    const Post = this as IPostModel;

    const page = Math.max(1,typeof options.page === 'string' ? parseInt(options.page,10): options.page || 1);
    const limit = Math.max(1, typeof options.limit === 'string' ? parseInt(options.limit, 10) : options.limit || 1);
    //const limit = Math.max(1,parseInt(options.limit ) || 10);
    const skip = (page - 1) * limit;
    
    try {
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
    } catch (error) {
      const errorMessage = error instanceof Error? error.message: 'Post couldnt be saved error';
      throw new Error(errorMessage);
    }
  };
  
  postSchema.statics.toggleLike = async function(postId: string,userId: mongoose.Types.ObjectId): Promise<{ post: IPost; message: string } | void>{
    const Post = this as IPostModel;  
     
    try {
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new Error('Invalid post ID');
      } 
      
      const existingLike = await Like.findOne({ user: userId, post: postId });
       
      let updatedPost: IPost | null = null;
      let message = '';
      
      if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        updatedPost = await Post.findByIdAndUpdate(
          postId,
          { $inc: { likesCount: -1 } },
          { new: true }
        );

        message = 'Like removed successfully';  

      } else {
        const newLike = new Like({user:userId,post: postId});
        await newLike.save();

        updatedPost = await Post.findByIdAndUpdate(
          postId,
          { $inc: { likesCount: 1 } },
          { new: true }
        );

        message = 'Post liked successfully';  
        
        if(!updatedPost){
          throw new Error('Post not found');
        }
        
        return { post: updatedPost, message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Like operation failed';
      throw new Error(errorMessage);
    }
    
  }

  const Post = mongoose.model<IPost,IPostModel>('Post', postSchema);
  export default Post;