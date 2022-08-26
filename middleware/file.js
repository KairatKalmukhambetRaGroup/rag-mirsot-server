import multer from "multer";
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, path.join(__dirname, '../public'))
    },
    filename(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname.replace(/ /g, '-'))
    }
})

const types = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'];

const fileFilter = (req, file, cb) => {
    if(types.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

export default multer({storage, fileFilter});