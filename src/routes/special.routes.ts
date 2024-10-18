import { Router } from "express";
import passport from "passport";
import { 
    createNote,
    createCategory    
} from "../controllers/note.controller";

const router = Router();

router.post('/special', passport.authenticate('jwt', {session: false}), createNote);
router.post('/createCat', passport.authenticate('jwt', {session: false}), createCategory);


export default router