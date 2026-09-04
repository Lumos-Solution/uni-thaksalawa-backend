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
    const rows = await UserClassDetails.find({ userName });
    if (rows.length === 0) {
        return { approved: [], pending: [] };
    }

    const classes = await Class.find({
        classId: { $in: rows.map((row) => row.classId) },
    }).populate('teacherId');

    /*
     * A student sees two lists: the classes a teacher has let them into, and the
     * requests still waiting for an answer. Both come from the same rows, told
     * apart by isJoined.
     */
    const classesFor = (isJoined: boolean) => {
        const ids = rows.filter((row) => row.isJoined === isJoined).map((row) => row.classId);
        return classes.filter((cls) => ids.includes(cls.classId));
    };

    return { approved: classesFor(true), pending: classesFor(false) };
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

    const teacher = await User.findOne({ userName: teacherUserName.trim() });
    if (!teacher) {
        throw new Error('Teacher not found');
    }

    const classes = await Class.find({ teacherId: teacher._id });
    if (classes.length === 0) {
        return [];
    }

    const pendingRequests = await UserClassDetails.find({
        classId: { $in: classes.map((cls) => cls.classId) },
        isJoined: false,
    }).sort({ _id: -1 });

    if (pendingRequests.length === 0) {
        return [];
    }

    /*
     * The teacher decides on a person, not a username, so each request is
     * returned together with the student's contact details and the class the
     * request is for.
     */
    const students = await User.find({
        userName: { $in: pendingRequests.map((request) => request.userName) },
    }).select(WITHOUT_PASSWORD);

    return pendingRequests.map((request) => ({
        request,
        classInfo: classes.find((cls) => cls.classId === request.classId),
        student: students.find((student) => student.userName === request.userName) || null,
    }));
}

