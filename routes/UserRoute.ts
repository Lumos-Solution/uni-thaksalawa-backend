import { Router } from 'express';
import {
    createUser,
    deleteUser,
    findUser,
    getUserEnrolledClasses,
    getUsers,
    signIn
} from '../controller/UserController';
import multer from "multer";
import {deleteUserClassDetail} from "../controller/UserClassDetailsController";

const router = Router();

const upload = multer({ dest: 'uploads/profilePics/' });

router.post('/signup', upload.single('profilePic'), createUser);
router.get('/getAll', getUsers);
router.post('/signin', signIn);
router.get('/find/:userName',findUser);
router.delete('/delete/:userName',deleteUser);
router.get('/getEnrollments/:userName',getUserEnrolledClasses);

export default router;
