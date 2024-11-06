import { Router, Request, Response } from 'express';
import { getMovies } from '../controllers/movie.controller';
import passport from "passport";

const router = Router();

router.get('/movies', getMovies );

export default router;
