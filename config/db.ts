import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/uni-thaksalawa');
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
};
