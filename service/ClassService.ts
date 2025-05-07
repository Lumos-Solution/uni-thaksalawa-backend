import { Class } from '../schema/ClassSchema';
import mongoose from 'mongoose';

export const createClass = async (classData: any) => {
    const {
        classType,
        title,
        subject,
        location,
        date,
        time,
        fee,
        teacherId,
        studentIds
    } = classData;

    const newClass = new Class({
        classType,
        title,
        subject,
        location,
        date,
        time,
        fee,
        teacherId: new mongoose.Types.ObjectId(teacherId),
        studentIds: studentIds.map((id: string) => new mongoose.Types.ObjectId(id))
    });

    return await newClass.save();
};

export const getAllClasses = async () => {
    return await Class.find()
        .populate('teacherId')
        .populate('studentIds');
};
