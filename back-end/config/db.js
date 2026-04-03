import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.mongoDB_url);
        console.log("Mongo DB connected succesfully ! ");
    } catch (error) {
        console.error("Error conecting to MONGODB", error);
        throw error;
    }
};

export default connectDB;
