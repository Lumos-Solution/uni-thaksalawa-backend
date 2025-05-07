import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    userName: string;
    password: string;
    name: string;
    email: string;
    contact: string;
    location: string;
    userType: 'afterAL' | 'undergraduate' | 'postgraduate' | 'other';
    roles: ('student' | 'teacher')[];
    enrolledClasses: mongoose.Types.ObjectId[];
    teachingClasses: mongoose.Types.ObjectId[];
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
        roles: [{ type: String, enum: ['student', 'teacher'] }],
        enrolledClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
        teachingClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
