import { Request, Response } from "express";
import Chat from "../models/chat";

export const getOrCreateChat = async (req: Request, res: Response) => {
    try {
        const { userId1, userId2 } = req.body;

        let chat = await Chat.findOne({
            participants: { $all: [userId1, userId2] },
        });

        if (!chat) {
            chat = new Chat({ participants: [userId1, userId2], messages: [] });
            await chat.save();
        }

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving or creating chat." });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { chatId, senderId, content, type } = req.body;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found." });
        }

        const message = chat.messages.create({
            senderId,
            content,
            type,
            timestamp: new Date(),
        });
        chat.messages.push(message);

        await chat.save();

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: "Error sending message." });
    }
};

export const getChatMessages = async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found." });
        }

        res.status(200).json(chat.messages);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving messages." });
    }
};
