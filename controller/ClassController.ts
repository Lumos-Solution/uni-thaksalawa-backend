import { Request, Response } from 'express';
import * as classService from '../service/ClassService';
import {convertToClassModel} from "../mapping/classMapper";


export const createClass = async (req: Request, res: Response) => {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
try{
    const {
        classType,
        title,
        subject,
        location,
        date,
        time,
        fee,
        teacherID
    } = req.body;

    if ( !classType || !title || !subject || !location || !date || !time || !fee || !teacherID) {
        res.status(400).json({ message: 'Missing required fields' });
    }

    if (req.file) {
        req.body.classImage = req.file.filename;
    }


    const classObj = await classService.createClass(req.body);
        res.status(201).json(classObj);

    } catch (err) {
        console.error('Error creating class:', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};

// export const createClass = async (req: Request, res: Response) => {
//     try {
//         const requiredFields = [
//             'classType', 'title', 'subject',
//             'location', 'date', 'time',
//             'fee', 'teacherId'
//         ];
//
//         for (const field of requiredFields) {
//             if (!req.body[field]) {
//                 return res.status(400).json({ message: `Missing field: ${field}` });
//             }
//         }
//
//         const classObj = await classService.createClass(req.body);
//         res.status(201).json(classObj);
//     } catch (err) {
//         console.error('Error creating class:', err);
//         res.status(500).json({ message: 'Server error', error: err });
//     }
// };

export const getClasses = async (req: Request, res: Response) => {
    try {
        const classes = await classService.getAllClasses();
        const classModels = classes.map(convertToClassModel);
        res.status(200).json(classModels);
    } catch (err) {
        console.error('Error getting classes:', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};
export const getClassesByTeacherID = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: 'Teacher ID is required' });
        }

        const classes = await classService.getClassesByTeacherId(id);

        if (!classes || classes.length === 0) {
          res.status(404).json({ message: 'No classes found for this teacher' });
        }

        const classModels = classes.map(convertToClassModel);
        res.status(200).json(classModels);
    } catch (err) {
        console.error('Error getting classes by teacher ID:', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};



