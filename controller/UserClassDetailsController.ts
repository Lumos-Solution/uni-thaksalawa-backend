import { Request, Response } from "express";
import {
    addUserClassDetails,
    approveJoinRequest,
    declineJoinRequest,
} from "../service/UserClassDetailsService";
import { statusOf } from "../error/AppError";

export const createUserClassDetail = async (req: Request, res: Response) => {
    try {
        // The requesting student is taken from the token so nobody can sign
        // another student up for a class.
        const userClassData = await addUserClassDetails({
            classId: req.body.classId,
            userName: req.auth!.userName,
        });

        res.status(201).json({
            message: 'Request sent to the teacher',
            data: userClassData,
        });
    } catch (error: any) {
        console.error('Error creating join request:', error);
        res.status(statusOf(error)).json({ message: error.message });
    }
};

export const approveUserClassDetail = async (req: Request, res: Response) => {
    try {
        const { userName, classId } = req.body;
        // The approver is always the logged-in teacher, never a name from the body.
        const approved = await approveJoinRequest(userName, classId, req.auth!.userName);

        res.status(200).json({ message: 'Request approved', data: approved });
    } catch (error: any) {
        console.error('Error approving request:', error);
        res.status(statusOf(error)).json({ message: error.message });
    }
};

export const declineUserClassDetail = async (req: Request, res: Response) => {
    try {
        const { userName, classId } = req.body;
        const declined = await declineJoinRequest(userName, classId, req.auth!.userName);

        res.status(200).json({ message: 'Request declined', data: declined });
    } catch (error: any) {
        console.error('Error declining request:', error);
        res.status(statusOf(error)).json({ message: error.message });
    }
};
