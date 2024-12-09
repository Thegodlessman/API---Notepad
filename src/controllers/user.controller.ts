import express, { Request, Response } from 'express';
import User, { IUser } from '../models/user'
import jwt from 'jsonwebtoken'
import { upload } from '../middlewares/multer.middleware';

import config from "../config/config"

function createToken(user: IUser) {
    return jwt.sign({
        profileImage: user.profileImage,
        id: user.id,
        fullName: user.name + ' ' + user.lastName,
        username: user.username,
        email: user.email,
    }, config.JWTSecret)
}

export const register = async (req: Request, res: Response): Promise<Response | any> => {
    const { name, lastName, username, email, password } = req.body;
    const profileImage = req.file?.path; // URL generada por Cloudinary

    if (!name || !lastName || !username || !email || !password) {
        return res.status(400).json({ msg: 'Debe completar todos los campos.' });
    }

    try {
        if (await User.findOne({ email }) || await User.findOne({ username })) {
            return res.status(400).json({ msg: 'El usuario o correo ya están registrados.' });
        }

        const newUser = new User({
            name,
            lastName,
            username,
            email,
            password,
            profileImage
        });
        await newUser.save();
        const token = createToken(newUser);

        return res.status(201).json({ token });
    } catch (error) {
        console.error('Error en el registro:', error);
        return res.status(500).json({ msg: 'Error al registrar usuario.' });
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