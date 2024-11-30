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

// Endpoint para subir imágenes
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const imageUrl = req.file?.path; // URL pública de la imagen
        if (!imageUrl) {
            throw new Error('No se pudo obtener la URL de la imagen');
        }

        res.json({ url: imageUrl }); // Respuesta con la URL de la imagen
    } catch (error) {
        console.error('Error en /upload:', error); // Registro del error detallado
        res.status(500).json({ message: 'Error al subir la imagen', error: error });
    }
});

// Endpoint para actualizar la imagen de perfil del usuario
router.put('/users/:userId/profile-image', upload.single('image'), async (req, res): Promise<Response | any> => {
    const { userId } = req.params;

    try {
        const imageUrl = req.file?.path; // URL de la imagen subida
        if (!imageUrl) {
            return res.status(400).json({ message: 'No se pudo obtener la URL de la imagen' });
        }

        // Buscar al usuario y actualizar su imagen de perfil
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.profileImage = imageUrl; // Actualizar el campo de imagen de perfil
        await user.save();

        res.status(200).json({ message: 'Imagen de perfil actualizada correctamente', profileImage: imageUrl });
    } catch (error) {
        console.error('Error al actualizar la imagen de perfil:', error);
        res.status(500).json({ message: 'Error al actualizar la imagen de perfil', error: error });
    }
});

export default router;
