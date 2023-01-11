import express from 'express';
import conversionRoutes from './conversion.js';
import visitorRoutes from './visitor.js';

const router = express.Router();

router.use('/conversion', conversionRoutes);
router.use('/visitor', visitorRoutes);

export default router;