import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
    classId:string;
    classType: string;
    title: string;
    subject: string;
    location: string;
    coordinates?: { lat: number; lng: number };
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
        // Only physical classes have a place; online ones legitimately have none.
        location: {
            type: String,
            default: '',
            required: function (this: any) {
                return this.classType === 'physical';
            },
        },
        // Set when the teacher drops a pin on the map, so the exact spot can be
        // shown again later. Absent for online classes and for older records.
        coordinates: {
            type: new mongoose.Schema(
                {
                    lat: { type: Number, required: true },
                    lng: { type: Number, required: true },
                },
                { _id: false }
            ),
            default: undefined,
        },
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
