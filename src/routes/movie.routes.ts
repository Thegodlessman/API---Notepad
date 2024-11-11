import { Router, Request, Response } from 'express';
import { detailsMovie, getMovies, getMoviesByCategory, searchMovies, addFavorite, getFavorite} from '../controllers/movie.controller';
import passport from "passport";

const router = Router();

router.get('/movies',  passport.authenticate('jwt', {session: false}), getMovies );
router.get('/movies/category/:category',  passport.authenticate('jwt', {session: false}), getMoviesByCategory);
router.get('/movies/search',  passport.authenticate('jwt', {session: false}),searchMovies)
router.get('/movies/:id',  passport.authenticate('jwt', {session: false}), detailsMovie)
router.post('/favorites', passport.authenticate('jwt', {session: false}), addFavorite);
router.get('/favorites/:userId',passport.authenticate('jwt', {session: false}), getFavorite )

export default router;
