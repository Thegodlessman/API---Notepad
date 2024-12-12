import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Request, Response } from "express";

cloudinary.config({
    cloud_name: "your-cloud-name",
    api_key: "your-api-key",
    api_secret: "your-api-secret",
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadImage = (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "chat-images" }, // Opcional: especificar carpeta
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: "Error uploading image." });
            }

            return res.status(200).json({ url: result?.secure_url });
        }
    );

    // Crear un stream para manejar el archivo
    const bufferStream = new (require("stream").Readable)();
    bufferStream.push(file.buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
};
