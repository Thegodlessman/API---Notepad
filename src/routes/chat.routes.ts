import express from "express";
import { getFriends, getMessages } from "../controllers/chat.controller";

const router = express.Router();

router.post("/friends", getFriends);

router.get("/:userId/:friendId", getMessages);

export default router;
