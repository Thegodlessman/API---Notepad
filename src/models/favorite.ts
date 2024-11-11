import mongoose, { Schema, Document } from "mongoose";

interface IFavorite extends Document {
    userId: string;  // ID del usuario que agregó la película a favoritos
    movieId: string; // ID único de la película en TMDB
    title: string;
    posterPath: string;
    releaseDate: string;
    voteAverage: number;
    genres: string[]; // Lista de géneros de la película
    createdAt: Date;  // Fecha de cuando se agregó a favoritos
}

const FavoriteSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true // Crear un índice para optimizar consultas por usuario
    },
    movieId: {
        type: String,
        required: true,
        index: true // Crear un índice para evitar duplicados por usuario y película
    },
    title: {
        type: String,
        required: true
    },
    posterPath: {
        type: String
    },
    releaseDate: {
        type: String
    },
    voteAverage: {
        type: Number
    },
    genres: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Índice único para evitar duplicados de la misma película en favoritos por usuario
FavoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model<IFavorite>("Favorite", FavoriteSchema);
