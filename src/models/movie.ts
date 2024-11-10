import mongoose, { Schema, Document } from "mongoose";

interface IMovie extends Document {
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    overview: string;
    genres: { id: number; name: string }[];
    runtime: number;
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
