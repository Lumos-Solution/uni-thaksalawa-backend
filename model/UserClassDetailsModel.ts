export class UserClassDetailsModel{
    userName:string;
    classId:string;
    isJoined:boolean;

    constructor(userName:string,classId:string,isJoined:boolean) {
        this.userName=userName;
        this.classId=classId;
        this.isJoined=isJoined;
    }
}