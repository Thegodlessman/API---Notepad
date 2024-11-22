import axios from "axios";
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Favorite from "../models/favorite";
import Comment from '../models/comment';

dotenv.config();

const TMDB_API_URL = 'https://api.themoviedb.org/3/movie/popular';
const apiKey = process.env.TMDB_API_KEY;

if (!apiKey) {
    throw new Error("API Key no encontrada. Verifica tu archivo .env.");
} else {
    console.log("The Movie Database: API Key detectada");
}

export const getMovies = async (req: Request, res: Response): Promise<Response | any> => {
    const page = Number(req.query.page) || 1;

    try {
        const response = await axios.get(TMDB_API_URL, {
            params: {
                api_key: apiKey,
                language: 'es-ES',
                page
            }
        });

        const peliculas = response.data.results;
        res.setHeader('Cache-Control', 'no-store');
        return res.json({ peliculas, page: response.data.page, total_pages: response.data.total_pages });
    } catch (error) {
        console.error('Error al obtener las películas:', error);
        return res.status(500).json({ message: 'Error al obtener las películas' });
    }
};

export const getMoviesByCategory = async (req: Request, res: Response): Promise<Response | any> => {
    const { category } = req.params;

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${category}`, {
            params: {
                api_key: apiKey,
                language: 'es-ES',
                page: 1,
            },
        });
        return res.status(200).json({
            message: `Películas de la categoría: ${category}`,
            data: response.data.results,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener películas por categoría",
        });
    }
};

export const searchMovies = async (req: Request, res: Response): Promise<Response | any> => {
    const { query, genre, release_year, vote_average } = req.query;

    if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Se requiere un término de búsqueda válido.' });
    }

    try {
        const params: any = {
            api_key: apiKey,
            language: 'es-ES',
            query,
            page: 1,
        };

        if (genre) params.genre = genre;
        if (release_year) params.release_year = release_year;
        if (vote_average) params.vote_average = vote_average;

        const response = await axios.get('https://api.themoviedb.org/3/search/movie', { params });

        return res.status(200).json({
            success: true,
            data: response.data.results,
            total_pages: response.data.total_pages,
            total_results: response.data.total_results,
        });
    } catch (error) {
        console.error("Error al buscar películas:", error);
        return res.status(500).json({ message: 'Error al buscar películas' });
    }
};

export const detailsMovie = async (req: Request, res: Response): Promise<Response | any> => {
    const { id } = req.params;

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
            params: {
                api_key: apiKey,
                language: 'es-ES'
            }
        });

        const movieDetails = response.data;
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json(movieDetails);
    } catch (error) {
        console.error('Error al obtener los detalles de la película:', error);
        return res.status(500).json({ message: 'Error al obtener los detalles de la película' });
    }
};

export const addFavorite = async (req: Request, res: Response): Promise<Response | any> => {
    const { userId, movieId, title, posterPath, releaseDate, voteAverage, genres } = req.body;

    try {
        const favorite = new Favorite({
            userId,
            movieId,
            title,
            posterPath,
            releaseDate,
            voteAverage,
            genres,
        });
        await favorite.save();
        return res.status(201).json({ message: 'Película guardada en favoritos.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al guardar la película.' });
    }
};

export const getFavorite = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const favorites = await Favorite.find({ userId: req.params.userId });
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los favoritos.' });
    }
};

export const removeFavorite = async (req: Request, res: Response): Promise<Response | any> => {
    const { userId, movieId } = req.body;

    try {
        const result = await Favorite.findOneAndDelete({ userId, movieId });

        if (result) {
            return res.status(200).json({ message: "Película eliminada de favoritos." });
        } else {
            return res.status(404).json({ message: "Película no encontrada en favoritos." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar la película de favoritos." });
    }
};

export const addComment = async (req: Request, res: Response): Promise<Response | any> => {
    const { movieId, userId, username, comment, rating } = req.body;

    if (!comment || comment.length > 240) {
        return res.status(400).json({ message: 'El comentario debe tener un máximo de 240 caracteres.' });
    }
    if (rating < 1 || rating > 10) {
        return res.status(400).json({ message: 'La valoración debe estar entre 1 y 10.' });
    }

    try {
        const existingComment = await Comment.findOne({ movieId, userId });
        if (existingComment) {
            existingComment.comment = comment;
            existingComment.rating = rating;
            await existingComment.save();
            return res.status(200).json({ message: 'Comentario actualizado con éxito.' });
        } else {
            const newComment = new Comment({ movieId, userId, username, comment, rating });
            await newComment.save();
            return res.status(201).json({ message: 'Comentario añadido con éxito.' });
        }
    } catch (error) {
        console.error("Error al añadir o actualizar comentario:", error);
        return res.status(500).json({ message: 'Error al añadir o actualizar el comentario.' });
    }
};

export const getCommentsByMovie = async (req: Request, res: Response): Promise<Response | any> => {
    const { movieId } = req.params;

    try {
        const comments = await Comment.find({ movieId }).sort({ createdAt: -1 });
        return res.status(200).json(comments);
    } catch (error) {
        console.error("Error al obtener comentarios:", error);
        return res.status(500).json({ message: 'Error al obtener los comentarios de la película.' });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    const { movieId, userId } = req.body;

    try {
        const result = await Comment.findOneAndDelete({ movieId, userId });
        if (result) {
            return res.status(200).json({ message: 'Comentario eliminado con éxito.' });
        } else {
            return res.status(404).json({ message: 'Comentario no encontrado.' });
        }
    } catch (error) {
        console.error("Error al eliminar comentario:", error);
        return res.status(500).json({ message: 'Error al eliminar el comentario.' });
    }
};
