import { Schema, model, Document } from 'mongoose';

interface CommentDocument extends Document {
    movieId: string;
    userId: string;
    comment: string;
    rating: number;
    createdAt: Date;
}

const commentSchema = new Schema<CommentDocument>({
    movieId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true,
        maxlength: 240  // Validación de máximo 240 caracteres
    },
    rating: {
        type: Number,
        required: true,
        min: 1,        // Valoración mínima permitida
        max: 10        // Valoración máxima permitida
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default model<CommentDocument>('Comment', commentSchema);
