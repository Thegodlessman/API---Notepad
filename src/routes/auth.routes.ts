import { Router } from "express";
import { register, login, deleteUser } from "../controllers/user.controller";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.delete("/delete", deleteUser);

export default router;