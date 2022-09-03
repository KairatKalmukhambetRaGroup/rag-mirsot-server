import express from "express";

import { getLangs, toggleLanguages } from "../controllers/lang.js";

const router = express.Router();

// router.post('/', addLang);
router.get('/', getLangs);
// router.patch('/toggle/:name', toggleLang);
router.patch('/toggleMany', toggleLanguages);

export default router;