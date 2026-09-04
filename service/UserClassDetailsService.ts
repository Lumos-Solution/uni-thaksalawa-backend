import { UserClassDetails } from "../schema/UserClassDetailsSchema";
import { Class } from "../schema/ClassSchema";
import { User } from "../schema/UserSchema";
import { AppError } from "../error/AppError";

const findClassOrFail = async (classId: string) => {
    const foundClass = await Class.findOne({ classId });
    if (!foundClass) {
        throw new AppError(`No class found with classId: ${classId}`, 404);
    }
    return foundClass;
};

/**
 * Approving and declining are the teacher's decisions alone, so both paths check
 * that the caller actually owns the class before touching the request.
 */
const findOwnedClassOrFail = async (classId: string, teacherUserName: string) => {
    const foundClass = await findClassOrFail(classId);
    const teacher = await User.findById(foundClass.teacherId);

    if (!teacher || teacher.userName !== teacherUserName) {
        throw new AppError('Only the teacher of this class can answer its requests', 403);
    }

    return foundClass;
};

export const addUserClassDetails = async (userClassData: { userName: string; classId: string }) => {
    const { userName, classId } = userClassData;
    const foundClass = await findClassOrFail(classId);

    const teacher = await User.findById(foundClass.teacherId);
    if (teacher?.userName === userName) {
        throw new AppError('You cannot request to join your own class', 400);
    }

    // One row per student and class, so a second click cannot queue a duplicate
    // request in the teacher's notifications.
    const existing = await UserClassDetails.findOne({ userName, classId });
    if (existing) {
        throw new AppError(
            existing.isJoined
                ? 'You are already enrolled in this class'
                : 'Your request is already waiting for the teacher to approve it',
            409
        );
    }

    return await UserClassDetails.create({ userName, classId, isJoined: false });
};

export const approveJoinRequest = async (
    userName: string,
    classId: string,
    teacherUserName: string
) => {
    const foundClass = await findOwnedClassOrFail(classId, teacherUserName);

    const approved = await UserClassDetails.findOneAndUpdate(
        { userName, classId, isJoined: false },
        { isJoined: true },
        { new: true }
    );

    if (!approved) {
        throw new AppError(`No pending request from ${userName} for class ${classId}`, 404);
    }

    // The class and the student both keep their own copy of the membership, so
    // they are kept in step with the approval. $addToSet makes this repeatable.
    const student = await User.findOne({ userName });
    if (student) {
        await Class.updateOne({ _id: foundClass._id }, { $addToSet: { studentIds: student._id } });
        await User.updateOne(
            { _id: student._id },
            { $addToSet: { enrolledClasses: foundClass._id } }
        );
    }

    return approved;
};

export const declineJoinRequest = async (
    userName: string,
    classId: string,
    teacherUserName: string
) => {
    await findOwnedClassOrFail(classId, teacherUserName);

    const declined = await UserClassDetails.findOneAndDelete({ userName, classId });
    if (!declined) {
        throw new AppError(`No request from ${userName} for class ${classId}`, 404);
    }

    return declined;
};

/** Used when a class is removed, so its requests do not outlive it. */
export const deleteUserClassDetails = async (userName: string, classId: string) => {
    const deleted = await UserClassDetails.findOneAndDelete({ userName, classId });

    if (!deleted) {
        throw new AppError(`No UserClassDetails found for ${userName} in class ${classId}`, 404);
    }

    return deleted;
};
