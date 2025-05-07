export class UserModel {
    _id?: string;
    userName: string;
    password: string;
    name: string;
    email: string;
    contact: string;
    location: string;
    userType: 'afterAL' | 'undergraduate' | 'postgraduate' | 'other';
    roles: ('student' | 'teacher')[];
    enrolledClasses: string[]; // Array of Class IDs
    teachingClasses: string[]; // Array of Class IDs

    constructor(
        userName: string,
        password: string,
        name: string,
        email: string,
        contact: string,
        location: string,
        userType: 'afterAL' | 'undergraduate' | 'postgraduate' | 'other',
        roles: ('student' | 'teacher')[],
        enrolledClasses: string[] = [],
        teachingClasses: string[] = []
    ) {
        this.userName = userName;
        this.password = password;
        this.name = name;
        this.email = email;
        this.contact = contact;
        this.location = location;
        this.userType = userType;
        this.roles = roles;
        this.enrolledClasses = enrolledClasses;
        this.teachingClasses = teachingClasses;
    }
}
