import { Router } from 'express';
import {
    createUser,
    deleteUser,
    findUser, getCurrentUser, getPendingRequests,
    getUserEnrolledClasses,
    getUsers,
    refreshToken,
    signIn, updateUser
} from '../controller/UserController';
import multer from "multer";
import { authenticate, authorizeSelf } from '../middleware/auth';

const router = Router();

const upload = multer({ dest: 'uploads/profilePics/' });

// --- Public: these are how a session is obtained in the first place ---
router.post('/signup', upload.single('profilePic'), createUser);
router.post('/signin', signIn);
router.post('/refresh', refreshToken);

// --- Protected: a valid access token is required from here down ---
router.get('/me', authenticate, getCurrentUser);
router.get('/getAll', authenticate, getUsers);
router.put('/update', authenticate, upload.single('profilePic'), updateUser);
router.get('/find/:userName', authenticate, findUser);
router.delete('/delete/:userName', authenticate, authorizeSelf(), deleteUser);
router.get('/getEnrollments/:userName', authenticate, authorizeSelf(), getUserEnrolledClasses);
router.get('/getRequests/:userName', authenticate, authorizeSelf(), getPendingRequests);

export default router;
