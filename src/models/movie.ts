import mongoose, { Schema, Document } from "mongoose";

interface IMovie extends Document {
    id: number;
    title: string;
    genre_ids: number[];
    release_date: string;
    vote_average: number;
    overview: string;
    poster_path?: string;
    [key: string]: any;
}

const MovieSchema: Schema = new Schema({
    title: { type: String, required: true },
    poster_path: { type: String },
    release_date: { type: String },
    vote_average: { type: Number },
    vote_count: { type: Number },
    overview: { type: String },
    genres: [{ id: Number, name: String }],
    runtime: { type: Number }
});

export default mongoose.model<IMovie>("Movie", MovieSchema);
