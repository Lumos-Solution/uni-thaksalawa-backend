import { Router } from 'express';
import { createClass, getClasses } from '../controller/ClassController';

const router = Router();

router.post('/', createClass);
router.get('/', getClasses);

export default router;
