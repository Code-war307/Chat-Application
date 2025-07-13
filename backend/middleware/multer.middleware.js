import multer from "multer";
import path from "path";
import fs from "fs";
import {v4 as uuid} from "uuid";

const TEMP_DIR = "./tempUploadFiles";
if(!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, TEMP_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueFileName = `${req.user._id}-${Date.now()}-${uuid()}${ext}`;
        cb(null, uniqueFileName);
    }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, 
    files: 5, 
  },
});