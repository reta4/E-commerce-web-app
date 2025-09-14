import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATA_BASE);
    console.log("DB CONNECTED");
  } catch (err) {
    console.log({ "fail to connect db": err });
    process.exit(1);
  }
};
