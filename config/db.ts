import mongoose from 'mongoose';

/*
 * The connection string comes from the environment so that database
 * credentials never live in the repository. See .env.example for the format.
 */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'MONGODB_URI must be set. Copy .env.example to .env and fill it in.'
    );
}

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
};
