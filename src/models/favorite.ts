import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: String, required: true },
    listName: { type: String, default: 'Favoritos' }
});

export default mongoose.model('Favorite', favoriteSchema);
