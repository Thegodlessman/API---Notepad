import { Router } from "express";
import { register, login, deleteUser } from "../controllers/user.controller";
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        console.log('Archivo recibido:', file); // Depura el archivo recibido
        return {
            folder: 'images',
            format: 'png', // Cambia el formato si es necesario
            resource_type: 'image',
        };
    },
});

const router = Router();
const upload = multer({ storage: storage as unknown as multer.StorageEngine });

router.post('/register', upload.single('image'), register);
router.post('/login', login);
router.delete("/delete", deleteUser);

export default router;