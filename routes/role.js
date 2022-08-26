import express from "express";
import { createRole, getRoles } from "../controllers/role.js";
import {auth, permit} from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, permit('superadmin'),  getRoles);
router.post('/',auth, permit('superadmin'),  createRole);

export default router;