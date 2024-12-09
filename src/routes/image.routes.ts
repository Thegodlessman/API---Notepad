import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import User from '../models/user';

const router = express.Router();

// Configuración de almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
        folder: 'images',
        format: 'png', // Cambia el formato si es necesario
        resource_type: 'image',
    }),
});

const upload = multer({ storage: storage as unknown as multer.StorageEngine });

// Endpoint de registro con imagen de perfil
router.post('/register', upload.single('profileImage'), async (req, res): Promise<Response | any> => {
    try {
        const { name, lastName, username, email, password } = req.body;
        const imageUrl = req.file?.path;

        // Validar campos obligatorios
        if (!name || !lastName || !username || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // Crear usuario
        const newUser = new User({
            name,
            lastName,
            username,
            email,
            password,
            profileImage: imageUrl || null, // Guardar la URL de la imagen si existe
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario', error });
    }
});

export default router;
