import { Router } from 'express';
import {
    createUser,
    deleteUser,
    findUser, getPendingRequests,
    getUserEnrolledClasses,
    getUsers,
    signIn
} from '../controller/UserController';
import multer from "multer";

const router = Router();

const upload = multer({ dest: 'uploads/profilePics/' });

router.post('/signup', upload.single('profilePic'), createUser);
router.get('/getAll', getUsers);
router.post('/signin', signIn);
router.get('/find/:userName',findUser);
router.delete('/delete/:userName',deleteUser);
router.get('/getEnrollments/:userName',getUserEnrolledClasses);
router.get('/getRequests/:userName',getPendingRequests);

export default router;
