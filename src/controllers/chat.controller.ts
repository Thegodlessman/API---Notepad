import { Request, Response } from "express";
import User from "../models/user";
import { Message } from "../models/message";

// Obtener amigos de un usuario
export const getFriends = async (req: Request, res: Response): Promise<Response | any> => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId).populate("friends", "username profileImage name lastname");
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        res.json(user.friends);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error obteniendo amigos" });
    }
};

export const getMessages = async (req: Request, res: Response): Promise<Response | any> => {
    const { userId, friendId } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: friendId },
                { sender: friendId, receiver: userId },
            ],
        }).sort({ timestamp: 1 });

        return res.json(messages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error obteniendo mensajes" });
    }
};