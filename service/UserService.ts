import {IUser, User} from '../schema/UserSchema';
import {UserModel} from "../model/UserModel";
import {UserClassDetails} from "../schema/UserClassDetailsSchema";
import {Class} from "../schema/ClassSchema";

export const createUser = async (userData: any) => {
    return await User.create(userData);
};

export const getAllUsers = async () => {
    return await User.find().populate('enrolledClasses teachingClasses');
};

export const getUserByUserName = async (userName: string) => {
    const user = await User.findOne({ userName }).populate('enrolledClasses teachingClasses');
    if (!user) {
        throw new Error(`User not found with userName: ${userName}`);
    }
    return user;
};

export const deleteUserByUserName = async (userName: string) => {
    return await User.findOneAndDelete({ userName });
};


export const getEnrolledClassesByUserName = async (userName: string) => {
    // Step 1: Find all rows in UserClassDetails where the user has enrolled
    const userClassRows = await UserClassDetails.find({ userName, isJoined: true });

    if (userClassRows.length === 0) {
        return [];
    }

    // Step 2: Extract all classIds from those rows
    const classIds = userClassRows.map(row => row.classId);

    // Step 3: Find all classes matching those IDs
    const enrolledClasses = await Class.find({ classId: { $in: classIds } });

    return enrolledClasses;
};




export async function getPendingJoinRequestsByTeacher(teacherUserName: string) {
    if (!teacherUserName || teacherUserName.trim() === '') {
        throw new Error('Invalid teacherUserName parameter');
    }

    // 1. Find the teacher by username
    const teacher = await User.findOne({ userName: teacherUserName.trim() });
    if (!teacher) {
        throw new Error('Teacher not found');
    }

    // 2. Find classes taught by this teacher, get their classId strings
    const classes = await Class.find({ teacherId: teacher._id }).select('classId');
    const classIds = classes.map(c => c.classId);

    if (classIds.length === 0) {
        // No classes found for this teacher, so no pending requests
        return [];
    }

    // 3. Find pending join requests with matching classIds and isJoined: false
    const pendingRequests = await UserClassDetails.find({
        classId: { $in: classIds },
        isJoined: false,
    });

    if (pendingRequests.length === 0) {
        // No pending requests found
        return [];
    }

    // 4. Get the class details for those classIds from pending requests
    const requestedClassIds = [...new Set(pendingRequests.map(r => r.classId))]; // unique classIds
    const classDetails = await Class.find({ classId: { $in: requestedClassIds } });

    // 5. Combine the pendingRequests with their class details (optional)
    // For example, return an array of objects like { request, classInfo }
    const result = pendingRequests.map((request) => {
        const classInfo = classDetails.find((cls) => cls.classId === request.classId);
        return {
            request,
            classInfo,
        };
    });

    return result;
}



