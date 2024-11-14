import { Schema, model, Document } from 'mongoose';

interface CommentDocument extends Document {
    movieId: string;
    username: string;
    userId: string;
    comment: string;
    rating: number;
    createdAt: Date;
}

const commentSchema = new Schema<CommentDocument>({
    movieId: { type: String, required: true },
    username: { type: String, required: true },
    userId: { type: String, required: true },
    comment: { type: String, required: true, maxlength: 240 },
    rating: { type: Number, required: true, min: 1, max: 10 },
    createdAt: { type: Date, default: Date.now }
});

commentSchema.index({ movieId: 1, userId: 1 }); // Índice compuesto

export default model<CommentDocument>('Comment', commentSchema);
