import bcrypt from 'bcryptjs';
import {IUser, User} from '../schema/UserSchema';
import {UserModel} from "../model/UserModel";
import {UserClassDetails} from "../schema/UserClassDetailsSchema";
import {Class} from "../schema/ClassSchema";
import {Schema, Types} from "mongoose";

const SALT_ROUNDS = 10;

// Passwords are never returned to the caller unless a function explicitly asks
// for them (only the sign-in path does).
const WITHOUT_PASSWORD = '-password';

const hashPassword = (plain: string) => bcrypt.hash(plain, SALT_ROUNDS);

export const createUser = async (userData: any) => {
    if (!userData?.password) {
        throw new Error('Password is required');
    }

    const created = await User.create({
        ...userData,
        password: await hashPassword(userData.password),
    });

    return await User.findById(created._id).select(WITHOUT_PASSWORD);
};

export const getAllUsers = async () => {
    return await User.find().select(WITHOUT_PASSWORD).populate('enrolledClasses teachingClasses');
};

export const getUserByUserName = async (userName: string) => {
    const user = await User.findOne({ userName })
        .select(WITHOUT_PASSWORD)
        .populate('enrolledClasses teachingClasses');
    if (!user) {
        throw new Error(`User not found with userName: ${userName}`);
    }
    return user;
};

/**
 * Checks a username/password pair and returns the user when they match.
 * Returns null on any failure so callers cannot tell an unknown user from a
 * wrong password.
 */
export const verifyCredentials = async (userName: string, password: string) => {
    const user = await User.findOne({ userName });
    if (!user) {
        return null;
    }

    const stored = user.password;
    const isHashed = /^\$2[aby]?\$/.test(stored);

    if (isHashed) {
        if (!(await bcrypt.compare(password, stored))) {
            return null;
        }
    } else {
        // Accounts created before password hashing was introduced still hold a
        // plain-text password. Accept it once, then upgrade it in place.
        if (stored !== password) {
            return null;
        }
        user.password = await hashPassword(password);
        await user.save();
    }

    return await User.findById(user._id).select(WITHOUT_PASSWORD);
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

export async function updateUser(userName:string, updateData:any) {
    if (!userName || typeof userName !== 'string') {
        throw new Error('Invalid userName');
    }

    const changes = { ...updateData };

    // A blank password field means "leave it alone"; a new one has to be hashed
    // before it reaches the database.
    if (changes.password) {
        changes.password = await hashPassword(changes.password);
    } else {
        delete changes.password;
    }

    const updatedUser = await User.findOneAndUpdate(
        { userName: userName.trim() },
        { $set: changes },
        { new: true, runValidators: true }
    ).select(WITHOUT_PASSWORD);

    if (!updatedUser) {
        throw new Error('User not found');
    }

    return updatedUser;
}

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
