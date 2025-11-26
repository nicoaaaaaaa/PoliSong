// config/uploadAlbum.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..');

const albumStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath;
        
        // Determinar destino según el tipo de archivo
        if (file.fieldname === 'imagenAlbum') {
            uploadPath = path.join(projectRoot, "uploads", "images");
        } else if (file.fieldname.startsWith('cancion')) {
            uploadPath = path.join(projectRoot, "uploads", "mp3");
        } else {
            uploadPath = path.join(projectRoot, "uploads", "temp");
        }
        
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const uploadAlbum = multer({
    storage: albumStorage,
    limits: { 
        fileSize: 50 * 1024 * 1024, // 50MB por archivo
        files: 31 // 1 imagen + 30 canciones máximo
    },
    fileFilter: (req, file, cb) => {
        // Para imagen del álbum
        if (file.fieldname === 'imagenAlbum') {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Solo se permiten imágenes para el álbum'), false);
            }
        }
        // Para archivos de canciones
        else if (file.fieldname.startsWith('cancion')) {
            const allowedTypes = ['audio/mpeg', 'audio/mp3'];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Solo se permiten archivos MP3 para las canciones'), false);
            }
        }
        // Cualquier otro campo
        else {
            cb(new Error(`Campo no esperado: ${file.fieldname}`), false);
        }
    }
});

export default uploadAlbum;