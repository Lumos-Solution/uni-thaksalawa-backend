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