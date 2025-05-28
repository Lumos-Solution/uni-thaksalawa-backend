import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    userName: string;
    password: string;
    name: string;
    email: string;
    contact: string;
    location: string;
    userType: 'afterAL' | 'undergraduate' | 'postgraduate' | 'other';
    enrolledClasses: mongoose.Types.ObjectId[];
    teachingClasses: mongoose.Types.ObjectId[];
    profilePic?: string;
}

const UserSchema: Schema = new Schema(
    {
        userName: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        contact: { type: String, required: true },
        location: { type: String, required: true },
        userType: {
            type: String,
            enum: ['afterAL', 'undergraduate', 'postgraduate', 'other'],
            required: true,
        },
        enrolledClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
        teachingClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
        profilePic: { type: String, default: '' }
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
