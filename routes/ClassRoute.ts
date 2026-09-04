import { Router } from 'express';
import {
    getClasses,
    createClass,
    getClassesByTeacherID,
    updateClass,
    deleteClass,
} from '../controller/ClassController';
import {upload} from "../middleware/multer";
import { authenticate } from '../middleware/auth';

const router = Router();

// Browsing the class catalogue stays open so visitors can see it before signing up.
router.get('/getAll', getClasses);

router.post('/add', authenticate, upload.single('classImage'), createClass);
router.get('/getClasses/:id', authenticate, getClassesByTeacherID);
router.put('/update/:id', authenticate, upload.single('classImage'), updateClass);
router.delete('/delete/:id', authenticate, deleteClass);


export default router;
