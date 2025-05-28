import { Router } from 'express';
import { createUser, getUsers } from '../controller/UserController';
import multer from "multer";

const router = Router();

const upload = multer({ dest: 'uploads/profilePics/' });

router.post('/signup', upload.single('profilePic'), createUser);

router.get('/getAll', getUsers);

export default router;
