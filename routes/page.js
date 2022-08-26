import express from "express";
import { updateImage, updateImages } from "../controllers/image.js";
import { createCard, createImage, createPage, createStaff, createSubPage, createText, getPageByName, getPages, getPagesByParent, getTextByNames, updateCard, updateItems, updatePage, updateStaff, updateText } from "../controllers/page.js";
import {auth, permit} from '../middleware/auth.js';
import uploadMiddle from '../middleware/file.js';

const router = express.Router();


// router.get('/',  getResources);
// router.post('/',  createPage);
router.get('/',  getPages);
// router.patch('/update', 
//     uploadMiddle.fields([
//         {name: 'icon', maxCount: 1},
//         {name: 'background', maxCount: 1},
//         {name: 'bgImage', maxCount: 4},
//     ]), 
//     updateItems);

// IMAGE
router.post('/image', auth, permit('admin','editor'), uploadMiddle.single('image'), createImage);
router.patch('/images/:parentId', auth, permit('admin','editor'), uploadMiddle.array('images'), updateImages);
router.patch('/image/:id', auth, permit('admin','editor'), uploadMiddle.single('image'), updateImage);
// staff
router.post('/staff',auth, permit('admin','editor'),  createStaff);
router.patch('/staff/:id',auth, permit('admin','editor'), uploadMiddle.single('image'), updateStaff);
// text
router.get('/text', getTextByNames);
router.patch('/text', auth, permit('admin','editor'), updateText);

router.patch('/update', auth, permit('admin','editor'), updateItems);
router.get('/parent/:name', getPagesByParent);
router.post('/text',auth, permit('admin','editor'),  createText);
router.post('/card',auth, permit('admin','editor'),  createCard);
router.patch('/card',auth, permit('admin','editor'),  updateCard);
router.post('/:name',auth, permit('admin','editor'),  createSubPage);
router.patch('/:name',auth, permit('admin','editor'),  updatePage);
router.get('/:name',  getPageByName);
export default router;