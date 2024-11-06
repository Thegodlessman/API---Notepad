import axios from "axios";
import dotenv from 'dotenv';
import { Request, Response } from 'express';
dotenv.config();

const TMDB_API_URL = 'https://api.themoviedb.org/3/movie/popular';
const apiKey = process.env.TMDB_API_KEY;

if (!apiKey) {
    throw new Error("API Key no encontrada. Verifica tu archivo .env.");
} else {
    console.log("The Movie Database: API Key detectada");
}

export const getMovies = async (req: Request, res: Response): Promise<Response | any> => {
    const page = req.query.page || 1; // Número de página recibido del front, por defecto 1
  
    try {
        const response = await axios.get(TMDB_API_URL, {
            params: {
                api_key: apiKey,
                language: 'es-ES',
                page
            }
        });
        
        const peliculas = response.data.results;
        return res.json({ peliculas, page: response.data.page, total_pages: response.data.total_pages });
    } catch (error) {
        console.error('Error al obtener las películas:', error);
        return res.status(500).json({ message: 'Error al obtener las películas' });
    }
};
