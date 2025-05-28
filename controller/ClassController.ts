import { Request, Response } from 'express';
import * as classService from '../service/ClassService';
import {convertToClassModel} from "../mapping/classMapper";
import {generateClassID} from "../IDgenarate/ClassIDGenerater";



export const createClass = async (req: Request, res: Response) => {
    try {
        const classId = await generateClassID();
        const { classType, title, subject, location, date, time, fee, teacherID, studentIDs } = req.body;
        const classImage = req.file?.filename || '';

        const classData = {
            classId,
            classType,
            title,
            subject,
            location,
            date,
            time,
            fee,
            teacherID,
            studentIDs,
            classImage,
        };

        const savedClass = await classService.createClass(classData);
        res.status(201).json({ message: 'Class created successfully', data: savedClass });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ message: 'Failed to create class'});
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



