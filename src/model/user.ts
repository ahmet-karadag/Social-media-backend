import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export interface IUser {
    username: string;
    email:string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IUserMethods {
    generateAuthToken(): string; 
}
interface IAuthData {
    username?: string;
    email: string;
    password: string;
}

interface IUserModel extends mongoose.Model<IUserDocument> {
   registerUser(data: IAuthData): Promise<IUserDocument>;
    findByCredentials(data: IAuthData): Promise<IUserDocument>;
}
export type IUserDocument = IUser & IUserMethods & mongoose.Document;

const userSchema = new mongoose.Schema<IUserDocument,IUserModel>({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [4, 'username must be at least 4 chracters'],
        maxlength: [15, 'username cannot exceed 20 chracters'],
        match: [/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters']
    },
  
},{ timestamps: true});

userSchema.pre<IUserDocument>('save', async function(){
    const user = this;

    if(user.isModified('password')){
       try {
         const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password,salt);
       } catch (error) {
        throw new Error('Password encryption failed');
        //return next(error);
       }
    }
    //next();
});

userSchema.statics.registerUser = async function (data: IAuthData): Promise<IUserDocument> {
    const User = this as IUserModel;

    const { username, email, password } = data;

    if(!username?.trim() || !email.trim() || !password){
     throw new Error('username, email and password are required');
    }
    //veritbanına kayıttan önce kontrol ediyorum.
    const existingUser = await User.findOne({
        $or: [
            { email: email.toLowerCase() },
            { username: username?.trim() }
        ]
    });
    if(existingUser){
     if(existingUser.email === email.toLowerCase()){
       throw new Error('this email is already registered');
     }
     if(existingUser.username === username?.trim()){
       throw new Error('this username is alraedy taken');
     }
    }
    const newUser = new User({
        username: username?.trim(),
        email: email.toLowerCase(),
        password: password //pre save sayesinde otomotik hasliyorum.
    });
    return await newUser.save();
};

userSchema.statics.findByCredentials = async function(data: IAuthData): Promise<IUserDocument>{
const User = this as IUserModel;

   
    const { email, password } = data;
    
    if (!email || !password || email.trim() === '' || password.trim() === '') {
        throw new Error('Email and password are required');
    }
    
    const user = await User.findOne({email: email.toLowerCase().trim()});
    if (!user) throw new Error('Invalid credentials');

   try {
     const isMatch = await bcrypt.compare(data.password,user.password);
    if(!isMatch) throw new Error('invalid password');
   } catch (error) {
    throw new Error('Authentication failed');
   }

    return user;
};

userSchema.methods.generateAuthToken = function (): string {
    const user = this as IUserDocument;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    try {
        const token = jwt.sign(
        { id: user._id, username: user.username },
        secret,
        { expiresIn: '1h' }
    );
    return token;
    } catch (error) {
       throw new Error('token generation failed'); 
    }
    
};
//güvenlik için json çıktısından şifreyi gizledik.
userSchema.methods.toJSON = function () {
    const user = this as IUserDocument;
    const userObject = user.toObject();

    delete userObject.password; // API yanıtlarında şifre asla gözükmez
    return userObject;
};


const User = mongoose.model<IUserDocument, IUserModel>('User',userSchema);

export default User;