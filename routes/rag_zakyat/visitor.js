import express from 'express';
import { addVisitor } from '../../controllers/rag_zakyat/visitors.js'; 

const router = express.Router();

router.post('/', addVisitor);

export default router;
