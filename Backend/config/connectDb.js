import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()



  const MONGO_URI = process.env.MONGODB_URL;

  if (!process.env.MONGODB_URL) {
    throw new Error("please provide MONGODB_URL in the .env file");
  }

async function connectDB(){
    try {
      console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("✅ MongoDB Connected Successfully");
        
        
    } catch (error) {
         console.log("mongodb connection error",error)
        process.exit(1)
        
    }
}
export default connectDB