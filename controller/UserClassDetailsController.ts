import {Request, Response} from "express";
import {UserClassDetails} from "../schema/UserClassDetailsSchema";
import {
    addUserClassDetails,
    deleteUserClassDetails,
    updateUserClassDetails
} from "../service/UserClassDetailsService";

export const createUserClassDetail = async (req: Request, res: Response) => {
    try {
        console.log("req.body:", req.body);

        const userClassData = await addUserClassDetails(req.body);

        res.status(201).json({
            message: 'User-Class detail created successfully',
            data: userClassData
        });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            message: 'Error creating user',

        });
    }
};

export const updateUserClassDetail = async (req: Request, res: Response) => {
    try {
        console.log("req.body:", req.body);

        const userClassData = await updateUserClassDetails(req.body.userName,req.body.classId);

            res.status(201).json({
            message: 'success',
            data: userClassData
        });

    } catch (error) {
        console.error("Error updating details:", error);
            res.status(500).json({
            message: 'Error updating user',

        });
    }
};

export const deleteUserClassDetail = async (req: Request, res: Response) => {
    try {
        const { userName, classId } = req.body;
        const result = await deleteUserClassDetails(userName, classId);
        res.status(200).json({ message: 'UserClassDetails deleted successfully', result });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};