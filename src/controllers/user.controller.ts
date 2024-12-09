import express, { Request, Response } from 'express';
import User, { IUser } from '../models/user'
import jwt from 'jsonwebtoken'

import config from "../config/config"

const router = express.Router();

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
    const profileImage = req.file?.path; // URL de la imagen subida

    if (!name || !lastName || !username || !email || !password) {
        return res.status(400).json({ msg: 'Debe completar todos los campos.' });
    }

    try {
        // Validaciones de duplicados
        if (await User.findOne({ email })) {
            return res.status(400).json({ msg: 'El correo ya está registrado.' });
        }

        if (await User.findOne({ username })) {
            return res.status(400).json({ msg: 'El nombre de usuario ya está registrado.' });
        }

        // Crear el usuario
        const newUser = new User({
            name,
            lastName,
            username,
            email,
            password,
            profileImage, // Guardar la URL de la imagen en el usuario
        });

        await newUser.save();
        return res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error al registrar el usuario.' });
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