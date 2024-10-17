import { Request, Response } from "express"
import User, {IUser} from '../models/user'
import jwt from 'jsonwebtoken'

import config from "../config/config"

function createToken(user: IUser){
    return jwt.sign({
        id: user.id,
        email: user.email
    }, config.JWTSecret)
}

export const register = async (req: Request, res: Response): Promise<Response | any  > => {
    if (!req.body.email || !req.body.password){
        return res.status(400).json({
            msg: 'Verifique que haya ingresado su correo y su contraseña'
        })
    }

    const user = await User.findOne({email: req.body.email})
    if(user){
        return res.status(400).json({
            msg: "El usuario ya existe"
        })
    }

    const newUser = new User(req.body)
    await newUser.save()

    return res.status(201).json(newUser)
}

export const login = async(req: Request, res: Response): Promise< Response | any > => {
    if (!req.body.email || !req.body.password){
        return res.status(400).json({
            msg: 'Verifique que haya ingresado su correo y su contraseña'
        })
    }

    const user = await User.findOne({
        email: req.body.email
    })

    if(!user){
        return res.status(400).json({
            msg: 'Este usuario no ha sido encontrado'
        });
    }

    const isMatch = await user.comparePassword(req.body.password)

    if(isMatch){
        return res.status(200).json({
            token: createToken(user)
        })
    }

    return res.status(400).json({
        msg: "El correo o la contraseña son incorrectos"
    })
}