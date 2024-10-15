import { Request, Response } from "express"
import User, {IUser} from '../models/user'

export const register = async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password){
        res.status(400).json({
            msg: 'Verifique que haya ingresado su correo y su contraseña'
        })
    }

    const user = await User.findOne({email: req.body.email})
    if(user){
        res.status(400).json({
            msg: "El usuario ya existe"
        })
    }
}

export const login = (req: Request, res: Response) => {
    res.send('login')
}