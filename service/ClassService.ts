import { Class } from '../schema/ClassSchema';
import mongoose from 'mongoose';
import {User} from "../schema/UserSchema";
import {AppError} from "../error/AppError";


export const createClass = async (classData: any) => {


    const {
        classId,
        classType,
        title,
        subject,
        location,
        coordinates,
        date,
        time,
        fee,
        teacherID,
        studentIDs,
        classImage
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
        classId,
        classType,
        title,
        subject,
        location,
        coordinates,
        date,
        time,
        fee,
        teacherId: teacher._id,
        studentIds: parsedStudents,
        classImage
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

export const deleteClassById = async (classId: string) => {
    const deletedClass = await Class.findOneAndDelete({ classId });

    if (!deletedClass) {
        throw new Error(`No class found with classId: ${classId}`);
    }

    return deletedClass;
};


/**
 * A class can only be changed by the teacher who owns it, and only while it is
 * still upcoming - once the start date has arrived the students have already
 * planned around the details, so they are frozen.
 */
export const updateClassById = async (
    classId: string,
    teacherUserName: string,
    updates: Record<string, any>
) => {
    const existing = await Class.findOne({ classId });
    if (!existing) {
        throw new AppError(`No class found with classId: ${classId}`, 404);
    }

    const teacher = await User.findById(existing.teacherId);
    if (!teacher || teacher.userName !== teacherUserName) {
        throw new AppError('You can only edit your own classes', 403);
    }

    if (hasStarted(existing.date)) {
        throw new AppError('This class has already started and can no longer be edited', 400);
    }

    Object.assign(existing, updates);
    return await existing.save();
};

/** Dates are stored as plain YYYY-MM-DD, so a string compare is enough. */
export const hasStarted = (date: string) => {
    const today = new Date().toISOString().slice(0, 10);
    return Boolean(date) && date < today;
};
