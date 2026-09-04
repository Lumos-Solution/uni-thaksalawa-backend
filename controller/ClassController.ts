import { Request, Response } from 'express';
import * as classService from '../service/ClassService';
import {convertToClassModel} from "../mapping/classMapper";
import {generateClassID} from "../IDgenarate/ClassIDGenerater";
import {deleteClassById, updateClassById} from "../service/ClassService";
import {statusOf} from "../error/AppError";
import {geocodeTown} from "../service/GeocodeService";

/*
 * Coordinates arrive as JSON because the form is sent as multipart/form-data.
 * A malformed pin is not worth failing the whole request over - the class just
 * keeps its town name without a map position.
 */
const parseCoordinates = (raw: any) => {
    if (!raw) return undefined;
    try {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return Number.isFinite(parsed?.lat) && Number.isFinite(parsed?.lng)
            ? { lat: parsed.lat, lng: parsed.lng }
            : undefined;
    } catch {
        return undefined;
    }
};



export const createClass = async (req: Request, res: Response) => {
    try {
        const classId = await generateClassID();
        const { classType, title, subject, location, date, time, fee, teacherID, studentIDs } = req.body;
        const classImage = req.file?.filename || '';

        // Online classes have no place, so the location fields are dropped rather
        // than stored as empty strings.
        // A pin is exact, so it wins; without one the town name is geocoded so the
        // class can still be found by a distance search.
        const isPhysical = classType === 'physical';
        const coordinates = isPhysical
            ? parseCoordinates(req.body.coordinates) ?? (await geocodeTown(location))
            : undefined;

        const classData = {
            classId,
            classType,
            title,
            subject,
            location: isPhysical ? location : '',
            coordinates,
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
            return;
        }

        // A teacher with no classes yet is not an error - the page just shows an
        // empty list, so an empty array is returned rather than a 404.
        const classes = await classService.getClassesByTeacherId(id);
        res.status(200).json(classes.map(convertToClassModel));
    } catch (err) {
        console.error('Error getting classes by teacher ID:', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};

export const deleteClass = async (req: Request, res: Response) => {
    try {
        const {id } = req.params;
        if (!id) {
            res.status(400).json({ message: 'Teacher ID is required' });
        }

        const result = await deleteClassById(id);
        res.status(200).json({ message: 'Class deleted successfully', result });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};




export const updateClass = async (req: Request, res: Response) => {
    try {
        const { classType, title, subject, location, date, time, fee } = req.body;
        const isPhysical = classType === 'physical';

        const updates: Record<string, any> = {
            classType,
            title,
            subject,
            location: isPhysical ? location : '',
            coordinates: isPhysical
                ? parseCoordinates(req.body.coordinates) ?? (await geocodeTown(location))
                : undefined,
            date,
            time,
            fee,
        };

        // The image is optional on an edit; leaving the file input empty keeps
        // whatever picture the class already has.
        if (req.file?.filename) {
            updates.classImage = req.file.filename;
        }

        const updated = await updateClassById(req.params.id, req.auth!.userName, updates);
        res.status(200).json({ message: 'Class updated successfully', data: updated });
    } catch (error: any) {
        console.error('Error updating class:', error);
        res.status(statusOf(error)).json({ message: error.message });
    }
};
