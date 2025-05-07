export class ClassModel {
    _id?: string;
    classType: string;
    title: string;
    subject: string;
    location: string;
    date: string;
    time: string;
    fee: number;
    teacherId: string;      // Reference to a User
    studentIds: string[];   // Array of User IDs

    constructor(
        classType: string,
        title: string,
        subject: string,
        location: string,
        date: string,
        time: string,
        fee: number,
        teacherId: string,
        studentIds: string[] = []
    ) {
        this.classType = classType;
        this.title = title;
        this.subject = subject;
        this.location = location;
        this.date = date;
        this.time = time;
        this.fee = fee;
        this.teacherId = teacherId;
        this.studentIds = studentIds;
    }
}
