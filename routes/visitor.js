import express from "express";
import { addVisitor, getVisitors, getVisitorsInRange } from "../controllers/visitor.js";
import {auth, permit} from '../middleware/auth.js';

const router = express.Router();


router.get('/range',auth, permit('admin', 'analyst'),  getVisitorsInRange);
router.get('/', auth, permit('admin', 'analyst'), getVisitors);
router.post('/', addVisitor);

export default router;