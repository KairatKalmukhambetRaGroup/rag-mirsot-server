import express from "express";
import { createConsultation, getConsultationAnalytics, getConsultations } from "../controllers/consultation.js";
import {auth, permit} from '../middleware/auth.js';

const router = express.Router();


router.get('/analytics', auth, permit('admin','analyst'), getConsultationAnalytics);
router.get('/:status', auth, permit('admin','analyst'), getConsultations);
router.post('/',  createConsultation);

export default router;