import {IUser, User} from '../schema/UserSchema';
import {UserModel} from "../model/UserModel";

export const createUser = async (userData: any) => {
    return await User.create(userData);
};

export const getAllUsers = async () => {
    return await User.find().populate('enrolledClasses teachingClasses');
};

