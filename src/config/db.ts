
import mongoose from "mongoose";

const connectDB = async(): Promise<void> =>{
   const mongoUri: string | undefined = process.env.MONGO_URI;
   
 try{

   if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is missing");
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    // any yerine: error nesnesinin bir Error örneği olup olmadığını kontrol ediyoruz
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unknown error occurred while connecting to MongoDB');
    }
    
    process.exit(1);
  }
};
export default connectDB;