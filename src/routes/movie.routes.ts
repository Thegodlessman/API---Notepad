import { Router, Request, Response } from 'express';
import {
    detailsMovie,
    getMovies,
    getMoviesByCategory,
    searchMovies,
    addFavorite,
    getFavorite,
    removeFavorite,
    addComment,
    getCommentsByMovie,
    deleteComment,
    getMovieRating
} from '../controllers/movie.controller';
import passport from "passport";

const router = Router();

router.get('/movies', getMovies);
router.get('/movies/category/:category', getMoviesByCategory);
router.get('/movies/search', searchMovies)
router.get('/movies/:id', detailsMovie)
router.post('/favorites', addFavorite);
router.delete('/favorites', removeFavorite)
router.get('/favorites/:userId', getFavorite)
router.post('/comments', addComment);
router.get('/comments/:movieId', getCommentsByMovie);
router.get('/movie/:movieId/average-rating', getMovieRating)
router.delete('/comments/:movieId/:userId', deleteComment)

export default router;
