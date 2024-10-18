import { Router } from "express";
import passport from "passport";
import { 
    createNote,
    createCategory,
    setFavorite,
    showNotes
} from "../controllers/note.controller";

const router = Router();

router.post('/special', passport.authenticate('jwt', {session: false}), createNote);
router.post('/createCat', passport.authenticate('jwt', {session: false}), createCategory);
router.patch('/setFav/:id',  passport.authenticate('jwt', {session: false}), setFavorite )
router.get('/showNotes', passport.authenticate('jwt', {session: false}), showNotes)

export default router