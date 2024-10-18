import { Router } from "express";
import passport from "passport";
import { 
    createNote,
    createCategory,
    setFavorite,
    showNotes,
    showCat,
    showFav
} from "../controllers/note.controller";

const router = Router();

router.post('/special', passport.authenticate('jwt', {session: false}), createNote);
router.post('/createCat', passport.authenticate('jwt', {session: false}), createCategory);
router.patch('/setFav/:id',  passport.authenticate('jwt', {session: false}), setFavorite )
router.get('/showFav', passport.authenticate('jwt', {session: false}), showFav)
router.get('/showNotes', passport.authenticate('jwt', {session: false}), showNotes)
router.get('/showCat',  passport.authenticate('jwt', {session: false}), showCat)

export default router