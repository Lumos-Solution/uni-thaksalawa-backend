import { Router } from 'express';
import {
    approveUserClassDetail,
    createUserClassDetail,
    declineUserClassDetail,
} from "../controller/UserClassDetailsController";
import { authenticate } from '../middleware/auth';

const router = Router();

// Requesting a class, and approving or declining a request, all require a session.
router.post('/add', authenticate, createUserClassDetail);
router.put('/approve', authenticate, approveUserClassDetail);
router.delete('/decline', authenticate, declineUserClassDetail);

export default router;
