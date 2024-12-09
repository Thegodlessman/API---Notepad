import express from 'express';
import { register, login, deleteUser } from '../controllers/user.controller';
import { upload } from '../middlewares/multer.middleware';

const router = express.Router();

// Ruta para registro con subida de imagen
router.post('/register', upload.single('profileImage'), register);

// Ruta para login
router.post('/login', login);

// Ruta para eliminar usuario
router.delete('/delete', deleteUser);

export default router;
