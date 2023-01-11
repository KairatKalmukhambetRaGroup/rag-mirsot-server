import express from 'express';
import { addButton, getButtons, getConversionRate, updateRate } from '../../controllers/rag_zakyat/conversion.js';

const router = express.Router();

router.post('/', addButton);
router.post('/:id', updateRate);
router.get('/rate', getConversionRate);
router.get('/', getButtons);

export default router;
