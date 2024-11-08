import { Request, Response } from "express"
import User, {IUser} from '../models/user'
import jwt from 'jsonwebtoken'

import config from "../config/config"
import { body } from "express-validator"

function createToken(user: IUser){
    return jwt.sign({   
        id: user.id,
        fullName: user.name + ' ' + user.lastName,
        username: user.username,
        email: user.email
    }, config.JWTSecret)
}

export const register = async (req: Request, res: Response): Promise<Response | any  > => {
    if (!req.body.email || !req.body.password || !req.body.username || !req.body.name || !req.body.lastName){
        return res.status(400).json({
            msg: 'Debe rellenar todos los campos para registrarse satisfactoriamente'
        })
    }

    const findMail = await User.findOne({email: req.body.email})
    if(findMail){
        return res.status(400).json({
            msg: "El correo electronico ya ha sido registrado"
        })
    }
    const findUsername = await User.findOne({username: req.body.username})
    if(findUsername){
        return res.status(400).json({
            msg: "El usuario ya ha sido registrado"
        })
    }

    const newUser = new User(req.body)
    await newUser.save()
    return res.status(201).json(newUser)
}

export const login = async(req: Request, res: Response): Promise< Response | any > => {
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