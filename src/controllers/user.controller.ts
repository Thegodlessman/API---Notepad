import { Request, Response } from "express"
import User, { IUser } from '../models/user'
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import jwt from 'jsonwebtoken'

import config from "../config/config"
import { body } from "express-validator"

function createToken(user: IUser) {
    return jwt.sign({
        profileImage: user.profileImage,
        id: user.id,
        fullName: user.name + ' ' + user.lastName,
        username: user.username,
        email: user.email,
    }, config.JWTSecret)
}

const storage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
        folder: 'images',
        format: 'png', // Cambia el formato si es necesario
        resource_type: 'image',
    }),
});

export const register = async (req: Request, res: Response): Promise<Response | any> => {
    const { name, lastname, username, email, password, profileImage } = req.body;
    const imageUrl = req.file?.path;

    if (!name || !lastname || !username || !email || !password) {
        return res.status(400).json({ msg: "Debe rellenar todos los campos para registrarse satisfactoriamente" });
    }

    try {
        // Verificar duplicados
        if (await User.findOne({ email })) {
            return res.status(400).json({ msg: "El correo electrónico ya ha sido registrado" });
        }

        if (await User.findOne({ username })) {
            return res.status(400).json({ msg: "El nombre de usuario ya ha sido registrado" });
        }

        // Crear nuevo usuario
        const newUser = new User({
            name,
            lastname,
            username,
            email,
            password,
            profileImage: imageUrl || null, // Guardar la URL de la imagen si existe
        });

        await newUser.save();

        return res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error al registrar el usuario" });
    }
};

export const login = async (req: Request, res: Response): Promise<Response | any> => {
    const { loginValue, password } = req.body;

    try {
        // Busca al usuario en base a email o username
        const user = await User.findOne({
            $or: [{ email: loginValue }, { username: loginValue }]
        });

        if (!user) {
            return res.status(400).json({ msg: 'Usuario o email no encontrado' });
        }

        // Verifica la contraseña
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
            return res.status(200).json({
                token: createToken(user)
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        // Obtener el token del encabezado de autorización
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ msg: "No se proporcionó un token" });
        }

        // Verificar y decodificar el token
        let decoded: any;
        try {
            decoded = jwt.verify(token, config.JWTSecret);
        } catch (error) {
            return res.status(401).json({ msg: "Token inválido o expirado" });
        }

        const userId = decoded.id; // Obtener el ID del usuario del token

        if (!userId) {
            return res.status(400).json({ msg: "No se pudo obtener el ID del usuario del token" });
        }

        // Eliminar al usuario de la base de datos
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        return res.status(200).json({ msg: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error en el servidor" });
    }
};