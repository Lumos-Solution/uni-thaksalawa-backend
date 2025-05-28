import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
    classId:string;
    classType: string;
    title: string;
    subject: string;
    location: string;
    date: string;
    time: string;
    fee: number;
    teacherId: mongoose.Types.ObjectId;
    studentIds: mongoose.Types.ObjectId[];
    classImage?: string;
}

const ClassSchema: Schema = new Schema(
    {
        classId:{type:String,required:true},
        classType: { type: String, required: true },
        title: { type: String, required: true },
        subject: { type: String, required: true },
        location: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        fee: { type: Number, required: true },
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        classImage: { type: String },
    },
    { timestamps: true }
);

export const Class = mongoose.model<IClass>('Class', ClassSchema);
