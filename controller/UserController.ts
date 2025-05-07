import { Request, Response } from 'express';
import * as userService from '../service/UserService';

export const createUser = async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
};

export const getUsers = async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.json(users);
};
