import { ClassModel } from '../model/ClassModel';

const toId = (value: any): string => {
    if (!value) return '';
    // A populated reference arrives as a document, an unpopulated one as an ObjectId.
    return typeof value === 'object' && value._id ? value._id.toString() : value.toString();
};

export const convertToClassModel = (classDoc: any): ClassModel => {
    const students = classDoc.studentIds || classDoc.studentList || [];
    const teacher = classDoc.teacherId;

    return new ClassModel({
        classId: classDoc.classId,
        classType: classDoc.classType,
        title: classDoc.title,
        subject: classDoc.subject,
        location: classDoc.location,
        // Only physical classes are pinned, so this is often absent.
        coordinates: classDoc.coordinates
            ? { lat: classDoc.coordinates.lat, lng: classDoc.coordinates.lng }
            : undefined,
        date: classDoc.date,
        time: classDoc.time,
        fee: classDoc.fee,
        classImage: classDoc.classImage,
        teacherId: toId(teacher),
        teacherName: typeof teacher === 'object' ? teacher?.name || teacher?.userName : '',
        studentList: students.map(toId).filter(Boolean),
    });
};
