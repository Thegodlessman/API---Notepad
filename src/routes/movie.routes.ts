import { Router, Request, Response } from 'express';
import { detailsMovie, getMovies, getMoviesByCategory, searchMovies} from '../controllers/movie.controller';
import passport from "passport";

const router = Router();

router.get('/movies', getMovies );
router.get('/movies/category/:category', getMoviesByCategory);
router.get('/movies/search', searchMovies)
router.get('/movies/:id', detailsMovie)

export default router;
