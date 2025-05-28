import { Request, Response } from 'express';
import * as userService from '../service/UserService';
import {deleteUserByUserName, getPendingJoinRequestsByTeacher} from "../service/UserService";

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

export const signIn = async (req: Request, res: Response) => {
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
          res.status(400).json({ message: 'Username and password are required' });
        }

        const users = await userService.getAllUsers();

        const matchedUser = users.find(
            user => user.userName === userName && user.password === password
        );

        if (matchedUser) {
            res.status(200).json({ message: 'Sign-in successful' });
        } else {
          res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Sign-in error:', error);
        res.status(500).json({message: 'Server error', error});
    }
};

export const findUser = async (req: Request, res: Response) => {
    try {
        const { userName } = req.params;
        console.log("userName:",userName);

        if (!userName) {
             res.status(400).json({ message: 'Username is required' });
        }

        const user = await userService.getUserByUserName(userName);
        res.status(200).json(user);
    } catch (err: any) {
        console.error('Error getting user:', err);
        res.status(500).json(err);
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const {userName } = req.params;
        if (!userName) {
            res.status(400).json({ message: 'UserName is required' });
        }

        const result = await deleteUserByUserName(userName);
        res.status(200).json({ message: 'user deleted successfully', result });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserEnrolledClasses = async (req: Request, res: Response) => {
    const { userName } = req.params;

    try {
        const classes = await userService.getEnrolledClassesByUserName(userName);
        res.status(200).json(classes);
    } catch (error) {
        console.error('Error in loading enrolled classes:', error);
        res.status(500).json({ message: 'Failed to load enrolled classes' });
    }
};


export async function getPendingRequests(req, res) {
    try {
        const teacherUserName = req.params.userName; // or from query/body

        const requests = await getPendingJoinRequestsByTeacher(teacherUserName);

        res.json(requests);
    } catch (error) {
        res.status(400).json({ message: `Error when loading the requests: ${error.message}` });
    }
}

