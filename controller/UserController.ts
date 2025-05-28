import { Request, Response } from 'express';
import * as userService from '../service/UserService';

/*export const createUser = async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
};*/


/*

export const createUser = async (req: Request, res: Response) => {
    try {
        const profilePic = req.file?.filename || '';
        const userData = { ...req.body, profilePic };

        const user = await userService.createUser(userData);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create user', error: err });
    }
};*/
export const createUser = async (req: Request, res: Response) => {
    try {
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);

        const { userName, password, name, email, contact, location, userType } = req.body;

        if (!userName || !password || !name || !email || !contact || !location || !userType) {
            res.status(400).json({ message: 'Missing required fields' });
        }


        if (req.file) {
            req.body.profilePic = req.file.filename;
        }

        const user = await userService.createUser(req.body);

        res.status(201).json(user);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};


export const getUsers = async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.json(users);
};
