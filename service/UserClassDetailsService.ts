import {UserClassDetails} from "../schema/UserClassDetailsSchema";

export const addUserClassDetails = async (userClassData: any) => {
    return await UserClassDetails.create(userClassData);
};

export const updateUserClassDetails = async (userName: string, classId: string) => {
    const updatedRecord = await UserClassDetails.findOneAndUpdate(
        { userName, classId },
        { isJoined: true },
        { new: true }
    );

    if (!updatedRecord) {
        throw new Error(`No UserClassDetails found for userName: ${userName} and classId: ${classId}`);
    }

    return updatedRecord;
};

export const deleteUserClassDetails = async (userName: string, classId: string) => {
    const deleted = await UserClassDetails.findOneAndDelete({ userName, classId });

    if (!deleted) {
        throw new Error(`No UserClassDetails found for userName: ${userName} and classId: ${classId}`);
    }

    return deleted;
};


