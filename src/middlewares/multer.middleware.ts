import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

export const upload = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: async (req, file) => ({
            folder: 'images',
            format: 'png', // Cambiar el formato si es necesario
            resource_type: 'image',
        }),
    }) as unknown as multer.StorageEngine, // Conversión explícita
});
