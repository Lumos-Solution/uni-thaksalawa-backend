import { User } from '../schema/UserSchema';

export const createUser = async (userData: any) => {
    return await User.create(userData);
};

export const getAllUsers = async () => {
    return await User.find().populate('enrolledClasses teachingClasses');
};
