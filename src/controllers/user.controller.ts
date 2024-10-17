import { Request, Response } from "express"
import User, {IUser} from '../models/user'

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

export const login = (req: Request, res: Response) => {
    res.send('login')
}