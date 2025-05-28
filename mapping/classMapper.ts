import { ClassModel } from '../model/ClassModel';
import mongoose from 'mongoose';

export const convertToClassModel = (classDoc: any): ClassModel => {

    const studentList = (classDoc.studentList || []).map((student: any) => {
        if (typeof student === 'string') {
            return student;
        } else if (student instanceof mongoose.Types.ObjectId) {
            return student.toString();
        } else if (typeof student === 'object' && student._id) {
            return student._id.toString();
        } else {
            return '';
        }
    });

    return new ClassModel(
        classDoc.classId,
        classDoc.classType,
        classDoc.title,
        classDoc.subject,
        classDoc.location,
        classDoc.date,
        classDoc.time,
        classDoc.fee,
        typeof classDoc.teacherId === 'object' && classDoc.teacherId._id
            ? classDoc.teacherId._id.toString()
            : classDoc.teacherId?.toString(),
        studentList
    );
};
