import express from 'express';
import multer from 'multer';
import { Request } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import User from '../models/user'; // Importar modelo de usuario

const router = express.Router();

// Configuración de almacenamiento en Cloudinary
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

const upload = multer({ storage: storage as unknown as multer.StorageEngine });

// En el backend (Express)
router.post('/upload', upload.single('image'), async (req, res): Promise<Response | any> => {
    try {
        const userId = req.body.userId;  // Recibimos el userId desde el body
        const imageUrl = req.file?.path;

        if (!imageUrl) {
            return res.status(400).json({ message: 'No se pudo obtener la URL de la imagen' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.profileImage = imageUrl;
        await user.save();

        res.status(200).json({ message: 'Imagen de perfil actualizada correctamente', profileImage: imageUrl });
    } catch (error) {
        console.error('Error en /upload:', error);
        res.status(500).json({ message: 'Error al subir la imagen', error });
    }
});


export default router;
