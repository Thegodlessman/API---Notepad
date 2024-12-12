import express from "express";
import { getFriends, getMessages } from "../controllers/chat.controller";

const router = express.Router();

router.post("/friends", getFriends);

router.post("/getMessages", getMessages);

export default router;
