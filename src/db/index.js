import mongoose from "mongoose";
import dotenv from "dotenv";
// import { createPayinSummaryView } from "../models/payin.modal.js";
// import { createPayinView } from "../models/payin.modal.js";
dotenv.config({
  path: "../.env",
});

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`,
      {
        maxPoolSize: 50,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      }
    );
    // await createPayinView();
    // await createPayinSummaryView();

    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
