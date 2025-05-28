import { Router } from 'express';
import {createUser, findUser, getUsers, signIn} from '../controller/UserController';
import multer from "multer";

const router = Router();

const upload = multer({ dest: 'uploads/profilePics/' });

router.post('/signup', upload.single('profilePic'), createUser);
router.get('/getAll', getUsers);
router.post('/signin', signIn);
router.get('/find/:userName',findUser);

export default router;
