import express from "express";
import { createRecource, getResources } from "../controllers/recource.js";
import {auth, permit} from '../middleware/auth.js';

const router = express.Router();


router.get('/',  getResources);
router.post('/', auth, permit('admin'), createRecource);

export default router;