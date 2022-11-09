import express from 'express';
import {auth, permit} from '../middleware/auth.js';
import uploadMiddle from '../middleware/file.js';
import { createPartner, getPartners, updatePartner } from '../controllers/partner.js';

const router = express.Router();

router.get('/', getPartners);
router.post('/', auth, permit('admin', 'editor'), uploadMiddle.single('image'), createPartner);
router.patch('/:id',auth, permit('admin', 'editor'), uploadMiddle.single('image'), updatePartner);

export default router;