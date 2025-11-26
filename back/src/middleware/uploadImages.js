// config/uploadImages.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..', '..');

// Storage para imágenes
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = path.join(projectRoot, "uploads", "images");
        
        // Crear directorio si no existe
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Nombre temporal, luego se renombra en el controller
        cb(null, Date.now() + ".png");
    }
});

// Filtro para solo aceptar imágenes
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, GIF, WebP)'));
    }
};

export const uploadImage = multer({
    storage: imageStorage, // ← CORREGIDO: usa imageStorage en lugar de storage
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: fileFilter // ← También puedes usar la función fileFilter que definiste arriba
});

export default uploadImage;