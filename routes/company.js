import express from "express";
import { createCompany, getCompanies } from "../controllers/company.js";

const router = express.Router();

router.post('/', createCompany);
router.get('/', getCompanies);

export default router;