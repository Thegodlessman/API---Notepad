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
        const userId = req.body.userId; // El ID del usuario debe venir en el body o el token
        const imageUrl = req.file?.path; // La URL de la imagen subida a Cloudinary

        if (!imageUrl) {
            return res.status(400).json({ message: 'No se pudo obtener la URL de la imagen' });
        }

        // Buscar el usuario por su ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar el campo 'profileImage' con la URL de la imagen
        user.profileImage = imageUrl;
        await user.save(); // Guardar el usuario actualizado en MongoDB

        // Enviar la respuesta con la URL de la imagen
        res.status(200).json({ message: 'Imagen de perfil actualizada correctamente', profileImage: imageUrl });
    } catch (error) {
        console.error('Error en /upload:', error);
        res.status(500).json({ message: 'Error al subir la imagen', error });
    }
});


export default router;
