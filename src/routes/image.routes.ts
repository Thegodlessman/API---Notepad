import express from 'express';
import multer from 'multer';
import { Request } from 'express';
import { Multer } from 'multer';

import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

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

// Endpoint para subir imágenes
router.post('/upload', upload.single('image'), (req, res) => {
    try {
        const imageUrl = req.file?.path; // URL pública de la imagen
        if (!imageUrl) {
            throw new Error('No se pudo obtener la URL de la imagen');
        }
        res.json({ url: imageUrl });
    } catch (error) {
        console.error('Error en /upload:', error); // Registro del error detallado
        res.status(500).json({ message: 'Error al subir la imagen', error });
    }
});

export default router;