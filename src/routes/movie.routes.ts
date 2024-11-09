import { Router, Request, Response } from 'express';
import { getMovies, getMoviesByCategory} from '../controllers/movie.controller';
import passport from "passport";

const router = Router();

router.get('/movies', getMovies );
router.get('/movies/category/:category', getMoviesByCategory);

export default router;
