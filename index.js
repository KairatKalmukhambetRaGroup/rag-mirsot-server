import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from "url";

import userRoutes from './routes/user.js';
import roleRoutes from './routes/role.js';
import resourceRoutes from './routes/resource.js';
import langRoutes from './routes/lang.js';
import consultationRoutes from './routes/consultation.js';
import pageRoutes from './routes/page.js';
import visitorRoutes from './routes/visitor.js';
import partnerRoutes from './routes/partner.js';
import companyRoutes from './routes/company.js';
import ragZakyatRoutes from './routes/rag_zakyat/index.js';

const app = express();
dotenv.config();


app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/images', express.static(path.join(__dirname, 'public')));
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/resources', resourceRoutes);
app.use('/langs', langRoutes);
app.use('/consultations', consultationRoutes);
app.use('/pages', pageRoutes);
app.use('/visitors', visitorRoutes);
app.use('/partners', partnerRoutes);
app.use('/companies', companyRoutes);

app.use('/rag_zakyat', ragZakyatRoutes);


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL_DEV, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error));
