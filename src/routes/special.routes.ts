import { Router } from "express";
import passport from "passport";
import { 
    createNote,
    createCategory,
    setFavorite,
    showNotes,
    showCat,
    showFav,
    deleteNote,
    addNoteToCat,
    showCatNotes
} from "../controllers/note.controller";

const router = Router();

router.post('/special', passport.authenticate('jwt', {session: false}), createNote);
router.post('/createCat', passport.authenticate('jwt', {session: false}), createCategory);
router.patch('/setFav/:id',  passport.authenticate('jwt', {session: false}), setFavorite );
router.post('/showFav', passport.authenticate('jwt', {session: false}), showFav);
router.post('/showNotes', passport.authenticate('jwt', {session: false}), showNotes);
router.get('/showCat',  passport.authenticate('jwt', {session: false}), showCat);
router.delete('/deleteNote/:id', passport.authenticate('jwt', {session: false}), deleteNote);
router.patch('/addNote/:id', passport.authenticate('jwt', {session: false}), addNoteToCat);
router.get('/showCategoryNotes/:catId', passport.authenticate('jwt', {session: false}), showCatNotes);

export default router