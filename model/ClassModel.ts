export class ClassModel {
    _id?: string;
    classType: string;
    title: string;
    subject: string;
    location: string;
    date: string;
    time: string;
    fee: number;
    classImage:string;
    teacherId: string;
    studentList: string[];

    constructor(
        classType: string,
        title: string,
        subject: string,
        location: string,
        date: string,
        time: string,
        fee: number,
        teacherId: string,
        classImage:string,
        studentList: string[] = []
    ) {
        this.classType = classType;
        this.title = title;
        this.subject = subject;
        this.location = location;
        this.date = date;
        this.time = time;
        this.fee = fee;
        this.classImage=classImage;
        this.teacherId = teacherId;
        this.studentList = studentList;
    }
}
