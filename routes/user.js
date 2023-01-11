import express from "express";
import { addCompany, addUser, changePassword, deleteUser, getUsers, login, resetPassword } from "../controllers/user.js";
import {auth, permit} from '../middleware/auth.js';

const router = express.Router();


router.get('/',  getUsers);
router.post('/login', login);
router.post('/adduser',auth, permit('superadmin'),   addUser);
router.delete('/:id', auth, permit('superadmin'),  deleteUser);
router.post('/reset', resetPassword)
router.patch('/change_password', auth, changePassword)
router.patch('/add_company', addCompany)

export default router;