import { ClassModel } from '../model/ClassModel';

const toId = (value: any): string => {
    if (!value) return '';
    // A populated reference arrives as a document, an unpopulated one as an ObjectId.
    return typeof value === 'object' && value._id ? value._id.toString() : value.toString();
};

/** A stored position, or undefined where the class was never geocoded. */
const toCoordinates = (value: any) => {
    if (typeof value?.lat !== 'number' || typeof value?.lng !== 'number') return undefined;
    return { lat: value.lat, lng: value.lng };
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
        /*
         * A class is given its position when it is saved: the teacher's pin if
         * they dropped one, otherwise the town geocoded by GeocodeService. So
         * the stored position is the only source here - a class that still has
         * none is one the backfill has not reached yet.
         */
        coordinates: toCoordinates(classDoc.coordinates),
        date: classDoc.date,
        time: classDoc.time,
        fee: classDoc.fee,
        classImage: classDoc.classImage,
        teacherId: toId(teacher),
        teacherName: typeof teacher === 'object' ? teacher?.name || teacher?.userName : '',
        studentList: students.map(toId).filter(Boolean),
    });
};
