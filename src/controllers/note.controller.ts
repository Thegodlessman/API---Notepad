import { Request, Response } from "express"
import Note from "../models/note"
import category from "../models/category"
import {check, validationResult} from "express-validator"
import mongoose from "mongoose"

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

export const setFavorite = async (req: Request, res: Response): Promise< Response | any> => {
    const { id } = req.params; 
    try{
        const note = await Note.findOne({
            _id: id, owner: req.body.owner
        })

        if(!note){
            return res.status(404).json({
                msg: "Nota no encontrada"
            })
        }

        if(note.favorite){
            note.favorite = false
        }else{
            note.favorite = true
        }

        await note.save()

        return res.status(200).json({
            msg: "Nota actualizada",
            note
        })
    }catch(error){
        return res.status(500).json({
            msg: "Error al actualizar",
            error
        })
    }
}

export const showNotes = async (req: Request, res: Response): Promise< Response | any> => {
    try{
        const notes = await Note.find({
            owner: req.body.owner
        })

        if(!notes){
            return res.status(404).json({
                message: "Notes not found",
                status: 404,
            });
        }
        return res.status(200).json({
            message: "Notes found",
            status: 200,
            notes,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Error showing notes",
            status: 500,
            error,
        });
    }
}

export const showCat = async (req: Request, res: Response): Promise< Response | any> => {
    try{
        const cat = await category.find({
            owner: req.body.owner
        })
        if(!cat){
            return res.status(404).json({
                message: "Series not found",
                status: 404,
            });
        }
        return res.status(200).json({
            message: "Series found",
            status: 200,
            cat,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Error showing series",
            status: 500,
            error,
        });
    }
}

export const showFav = async (req: Request, res: Response): Promise< Response | any> => {
    try{
        const favNotes = await Note.find({owner: req.body.owner, favorite: true})

        if(!favNotes){
            return res.status(404).json({
                msg: "Notas no encontradas"
            })
        }
        return res.status(200).json({
            msg: "Notas encontradas",
            favNotes
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Error showing notes",
            status: 500,
            error,
        });
    }
}

export const deleteNote = async (req: Request, res: Response): Promise< Response | any> => {
    try{
        const {id} = req.params; 
        const note = await Note.findOne({
            _id: id,
            owner: req.body.owner
        })

        if(!note){
            return res.status(404).json({
                message: "Note not found",
                status: 404,
            });
        }

        await Note.deleteOne({
            _id: id,
            owner: req.body.owner
        }).exec();
        return res.status(200).json({
            msg: "Nota eliminada", 
            note
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Error deleting note",
            status: 500,
            error,
        });
    }
}

export const addNoteToCat = async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params;
    const { catId, owner } = req.body;

    try {
        // Buscar la categoría por su _id
        const cat = await category.findById(catId);
        if (!cat) {
            return res.status(404).json({
            msg: "Categoría no encontrada",
            });
        }
      // Actualizar la nota y asociarla con la categoría
        const note = await Note.findOneAndUpdate(
            { _id: id, owner }, // Asegurarse de que la nota y el owner existan
            { catId },          // Actualizamos la nota para asignarle la categoría
            { new: true }       // Devolver la nota actualizada
        );
        if (!note) {
            return res.status(404).json({
            message: "Nota no encontrada",
            status: 404,
            });
        }
        // No es necesario llamar a save() después de findOneAndUpdate
        return res.status(200).json({
            message: "Nota agregada a la categoría",
            status: 200,
            note,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error al actualizar la nota",
            status: 500,
            error // Devolver el mensaje de error
        });
    }
};

export const showCatNotes = async (req: Request, res: Response): Promise<Response | any> => {
  const { catId } = req.params;
  const { owner } = req.body; // Asegúrate de que este campo esté presente en el body

  try {
    // Imprimir catId y owner para depuración
    console.log("catId:", catId);
    console.log("owner:", owner);

    // Validar si catId es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(catId)) {
      return res.status(400).json({
        message: "Categoría inválida",
        status: 400,
      });
    }

    // Buscar notas por owner y catId
    const notes = await Note.find({ owner, catId });

    // Verificar si no se encontraron notas
    if (notes.length === 0) {
      return res.status(404).json({
        message: "No se encontraron notas para esta categoría",
        status: 404,
      });
    }

    // Devolver las notas encontradas
    return res.status(200).json({
      message: "Notas encontradas",
      status: 200,
      notes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al mostrar las notas",
      status: 500,
      error
    });
  }
};