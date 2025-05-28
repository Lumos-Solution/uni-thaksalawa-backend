import { Router } from 'express';
import {
    createUserClassDetail,
    deleteUserClassDetail,
    updateUserClassDetail
} from "../controller/UserClassDetailsController";



const router = Router();

router.post('/add', createUserClassDetail);
router.put('/update', updateUserClassDetail);
router.delete('/delete', deleteUserClassDetail);


export default router;
