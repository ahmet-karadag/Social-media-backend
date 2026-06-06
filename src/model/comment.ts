
import mongoose,{Document,Model, Schema} from "mongoose";
import { error } from "node:console";


interface IComment extends Document {
author: mongoose.Types.ObjectId;
post: mongoose.Types.ObjectId;
content: string;
likes: mongoose.Types.ObjectId[];
createdAt: Date;
updatedAt: Date;
}

interface ICreateCommentData {
    authorId: string;
    postId: string;
    content: string;
}
interface IGetCommentOptions {
    page?: string | number ;
   limit?: string | number;
}
interface IGetCommentsResult {
    comments: IComment[];
    pagination: {
            totalComments: number;
            totalPages: number;
            currentPage: number;
            limit:number;
        }
}



interface ICommentModel extends Model<ICommentDocument>{
    createComment(data:ICreateCommentData): Promise<ICommentDocument>;
    getCommentsByPost(postId: string ,options: IGetCommentOptions): Promise<IGetCommentsResult>;
}
export type ICommentDocument = IComment & Document;

const commentSchema = new mongoose.Schema<IComment,ICommentModel>({
author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
},
content : {
    type : String,
    required : [true,'comment is required'],
    trim: true
},
likes :[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
}]
},{timestamps: true});

commentSchema.statics.createComment = async function(data:ICreateCommentData): Promise<ICommentDocument>{
const Comment = this as ICommentModel;
if (!data || typeof data !== "object") {
    throw new Error("missing data");
  }
  const {authorId,postId,content} = data;

  if(!authorId || !postId || !content.trim()){
     throw new Error('missinField: authorId, postId, and content are required');
  }
  if (!mongoose.Types.ObjectId.isValid(authorId) || !mongoose.Types.ObjectId.isValid(postId)) {
          throw new Error('invalid id for mongodb');
      }
      const cleanContent = content.trim(); //cumlenin başı ve sondaki boşlukları temizleme işlemim
      const newComment = new Comment({
        author: new mongoose.Types.ObjectId(authorId),
        post: new mongoose.Types.ObjectId(postId),
        content: cleanContent
      });
   return await newComment.save();
}

commentSchema.statics.getCommentsByPost = async function(postId: string, options: IGetCommentOptions = {}): Promise<IGetCommentsResult>{
const Comment = this as ICommentModel;
if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new Error("invalid postId");
  }
  const page = Math.max(1,typeof options?.page === 'string' ? parseInt(options.page,10): options.page || 1);
  const limit = Math.max(1, typeof options?.limit === 'string' ? parseInt(options.limit, 10) : options.limit || 1);
  const skip = (page - 1) * limit;

  const comments = await Comment.find({post: postId})
  .sort({createdAt: -1})
  .skip(skip)
  .limit(limit)
  .populate('author','username');
  
   const totalComments = await Comment.countDocuments({post: postId});
    const totalPages = Math.ceil(totalComments / limit);
   return {
        comments,
        pagination: {
            totalComments,
            totalPages,
            currentPage: page,
            limit
        }
    };
}


const Comment = mongoose.model<IComment,ICommentModel>("Comment", commentSchema);
export default Comment;