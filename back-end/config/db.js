import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = process.env.mongoDB_url || process.env.MONGODB_URL;

        if (!mongoUri) {
            console.warn("MongoDB connection string is missing. Starting without a database connection.");
            return false;
        }

        await mongoose.connect(mongoUri);
        console.log("Mongo DB connected succesfully ! ");
        return true;
    } catch (error) {
        console.error("Error conecting to MONGODB", error);
        console.warn("Starting backend without a database connection.");
        return false;
    }
};

export default connectDB;
