import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );

    // MongoDb connection error handler
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error: ", err);
    });
  } catch (error) {
    console.log("mongodb connection error: ", error);
    process.exit(1); // Exit the process if the initial connection fails
  }
};

export default connectDb;
