import { Router } from 'express';
import {getClasses, createClass, getClassesByTeacherID, deleteClass} from '../controller/ClassController';
import {upload} from "../middleware/multer";

const router = Router();

router.get('/getAll', getClasses);
router.post('/add', upload.single('classImage'),createClass);
router.get('/getClasses/:id', getClassesByTeacherID);
router.delete('/delete/:id',deleteClass);


export default router;
