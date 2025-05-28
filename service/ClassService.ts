import { Class } from '../schema/ClassSchema';
import mongoose from 'mongoose';
import {User} from "../schema/UserSchema";


export const createClass = async (classData: any) => {
    const {
        classType,
        title,
        subject,
        location,
        date,
        time,
        fee,
        teacherID,
        studentIDs
    } = classData;


    const teacher = await User.findOne({ userName: teacherID });
    if (!teacher) {
        throw new Error(`No user found with username: ${teacherID}`);
    }


    let parsedStudents: mongoose.Types.ObjectId[] = [];
    try {
        const rawList = typeof studentIDs === 'string' ? JSON.parse(studentIDs) : studentIDs;
        parsedStudents = rawList.map((id: string) => new mongoose.Types.ObjectId(id));
    } catch (e) {
        throw new Error('Invalid studentIDs format');
    }


    const newClass = new Class({
        classType,
        title,
        subject,
        location,
        date,
        time,
        fee,
        teacherId: teacher._id,
        studentIds: parsedStudents
    });

    return await newClass.save();
};
export const getAllClasses = async () => {
    return await Class.find()
        .populate('teacherId')
        .populate('studentIds');
};

export const getClassesByTeacherId = async (userName: string) => {
    console.log("Looking for userName:", userName);

    const teacher = await User.findOne({
        userName: userName
    });

    console.log("Result from DB:", teacher);

    if (!teacher) {
        throw new Error('Teacher not found');
    }

    return await Class.find({ teacherId: teacher._id })
        .populate('teacherId')
        .populate('studentIds');
};

