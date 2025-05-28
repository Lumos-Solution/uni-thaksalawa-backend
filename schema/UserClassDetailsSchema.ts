import mongoose, { Schema, Document } from 'mongoose';

export interface IUserClassDetails extends Document {
    classId: string;
    userName: string;
    isJoined: boolean;
}

const UserClassDetailsSchema: Schema = new Schema({
    classId: {
        type:String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    isJoined: {
        type: Boolean,
        default: false
    }
});

export const UserClassDetails = mongoose.model<IUserClassDetails>('UserClassDetails', UserClassDetailsSchema);
