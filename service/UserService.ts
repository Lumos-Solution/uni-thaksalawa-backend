import {IUser, User} from '../schema/UserSchema';
import {UserModel} from "../model/UserModel";

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
