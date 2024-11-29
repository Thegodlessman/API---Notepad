declare module 'multer-storage-cloudinary' {
    import { StorageEngine } from 'multer';

    interface Params {
        folder?: string; // Añade la propiedad folder aquí
        format?: string;
        resource_type?: string;
        [key: string]: any; // Permitir otras propiedades dinámicas
    }

    export class CloudinaryStorage implements StorageEngine {
        constructor(options: {
            cloudinary: any;
            params?: Params | ((req: Express.Request, file: Express.Multer.File) => Params);
        });
    }
}
