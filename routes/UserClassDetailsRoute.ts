import { Router } from 'express';
import {
    createUserClassDetail,
    deleteUserClassDetail,
    updateUserClassDetail
} from "../controller/UserClassDetailsController";
import { authenticate } from '../middleware/auth';



const router = Router();

// Enrolling in a class, and approving or rejecting a request, all require a session.
router.post('/add', authenticate, createUserClassDetail);
router.put('/update', authenticate, updateUserClassDetail);
router.delete('/delete', authenticate, deleteUserClassDetail);


export default router;
