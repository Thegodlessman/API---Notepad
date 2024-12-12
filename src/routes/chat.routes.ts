import express from "express";
import { getOrCreateChat, sendMessage, getChatMessages } from "../controllers/chat.controller";

const router = express.Router();

router.post("/chat", getOrCreateChat);
router.post("/chat/message", sendMessage);
router.get("/chat/:chatId/messages", getChatMessages);

export default router;
