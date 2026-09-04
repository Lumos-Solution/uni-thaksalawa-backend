/**
 * The shape a class takes on the wire. It is deliberately flatter than the
 * mongoose document: the teacher is reduced to an id plus a display name, and
 * the map pin is carried along so the browser can measure how far away a
 * physical class is.
 */
export class ClassModel {
    classId: string;
    classType: string;
    title: string;
    subject: string;
    location: string;
    coordinates?: { lat: number; lng: number };
    date: string;
    time: string;
    fee: number;
    classImage: string;
    teacherId: string;
    teacherName: string;
    studentList: string[];

    constructor(fields: {
        classId: string;
        classType: string;
        title: string;
        subject: string;
        location: string;
        coordinates?: { lat: number; lng: number };
        date: string;
        time: string;
        fee: number;
        classImage?: string;
        teacherId: string;
        teacherName?: string;
        studentList?: string[];
    }) {
        this.classId = fields.classId;
        this.classType = fields.classType;
        this.title = fields.title;
        this.subject = fields.subject;
        this.location = fields.location;
        this.coordinates = fields.coordinates;
        this.date = fields.date;
        this.time = fields.time;
        this.fee = fields.fee;
        this.classImage = fields.classImage ?? '';
        this.teacherId = fields.teacherId;
        this.teacherName = fields.teacherName ?? '';
        this.studentList = fields.studentList ?? [];
    }
}
