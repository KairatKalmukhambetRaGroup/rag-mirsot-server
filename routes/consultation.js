import express from "express";
import { archiveRequest, createConsultation, deleteRequest, getAllArchiveByYear, getConsultationAnalytics, getConsultations, getConsultationYears } from "../controllers/consultation.js";
import {auth, permit} from '../middleware/auth.js';

const router = express.Router();

router.get('/download_archive', auth, permit('admin','analyst'), getAllArchiveByYear);
router.get('/years', auth, permit('admin','analyst'), getConsultationYears);
router.get('/analytics', auth, permit('admin','analyst'), getConsultationAnalytics);
router.get('/:status', auth, permit('admin','analyst'), getConsultations);
router.post('/',  createConsultation);
router.patch('/:id', auth, permit('admin','analyst'), archiveRequest);
router.delete('/:id', auth, permit('admin','analyst'), deleteRequest);


export default router;