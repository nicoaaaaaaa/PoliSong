import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtener el directorio raíz del proyecto (back/)
const projectRoot = path.join(__dirname, '..', '..');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(projectRoot, "uploads", "mp3");
        
        // Crear directorio si no existe
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + ".mp3");
    }
});

export const uploadSingle = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }
});

export const uploadMultiple = multer({
    storage,
    limits: { 
        fileSize: 50 * 1024 * 1024,
        files: 30
    }
}).any(); // <- Esto acepta cualquier campo de archivo

export default uploadSingle;