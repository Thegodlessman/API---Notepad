import { Request, Response } from "express"
import Note from "../models/note"
import user from "../models/user"
import category from "../models/category"
import {check, validationResult} from "express-validator"

export const createNote = async (req: Request, res: Response): Promise<Response | any > => {
    await check("title")
        .notEmpty()
        .withMessage("Debe ingresar un titulo")
        .isLength({max: 200})
        .withMessage("El titulo es demasiado largo")
        .run(req)
    await check("content")
        .isLength({max: 240})
        .withMessage("La nota es demasiado larga")
        .run(req)
    
    let result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(400).json({
            msg: "Algo ha salido mal",
            errors: result.array()
        })
    }

    const {title, content, catId, owner} = req.body

    if(catId){
        const cat = await category.findOne({
            name: catId
        })
        if(!cat){
            return res.status(404).json({
                msg: "categoria no encontrada",
                status: 404
            })
        }
    }

    try{
        const trash = false
        const favorite = false
        const note = new Note({
            title,
            content,
            catId,
            favorite,
            trash,
            owner
        })

        await note.save()

        return res.status(201).json({
            msg: "La nota ha sido creada",
            note_info: {
                title, 
                content,
                catId,
                favorite,
                trash, 
                owner
            }
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Error creating note",
            status: 500,
            error: error,
        });
    }
}

export const createCategory = async (req: Request, res: Response): Promise<Response | any > =>{
    await check("name").notEmpty().withMessage("La categoria debe tener nombre").run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "you have the following errors",
            errors: errors.array(),
        });
    }

    const {name, description, owner} = req.body;
    try{
        const cat = new category({
            name,
            description,
            owner
        })

        await cat.save()
        return res.status(200).json({
            msg: "categoria creada",
            cat_info: {
                name,
                description,
                owner
            }
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Error creating serie",
            status: 500,
            error,
        });
    }
}