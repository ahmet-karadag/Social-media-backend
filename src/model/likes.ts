
  import mongoose,{Schema,Document} from 'mongoose';

  export interface ILike {
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    createdAt?: Date;
  }

  export type ILikeDocument = ILike & Document;

  const likeSchema = new mongoose.Schema <ILikeDocument> ({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true    
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true    
    }
  });

  //compound index
  likeSchema.index({ user: 1, post: 1 }, { unique: true });

  const Like = mongoose.model<ILikeDocument>('Like', likeSchema);
  export default Like;