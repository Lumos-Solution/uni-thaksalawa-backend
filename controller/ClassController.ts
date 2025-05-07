import { Request, Response } from 'express';
import * as classService from '../service/ClassService';

export const createClass = async (req: Request, res: Response) => {
    try {
        const requiredFields = [
            'classType', 'title', 'subject',
            'location', 'date', 'time',
            'fee', 'teacherId'
        ];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `Missing field: ${field}` });
            }
        }

        const classObj = await classService.createClass(req.body);
        res.status(201).json(classObj);
    } catch (err) {
        console.error('Error creating class:', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};

export const getClasses = async (req: Request, res: Response) => {
    try {
        const classes = await classService.getAllClasses();
        res.status(200).json(classes);
    } catch (err) {
        console.error('Error getting classes:', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};
