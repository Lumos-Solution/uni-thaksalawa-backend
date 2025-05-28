import { Router } from 'express';
import {getClasses, createClass, getClassesByTeacherID} from '../controller/ClassController';
import multer from "multer";
import {upload} from "../middleware/multer";

const router = Router();

router.get('/getAll', getClasses);
router.post('/add', upload.single('classImage'),createClass);
router.get('/getClasses/:id', getClassesByTeacherID);


export default router;
