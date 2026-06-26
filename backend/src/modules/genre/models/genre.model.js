import mongoose from 'mongoose'
import { allowedGenre } from '../validators/genre.validator.js'

const GenreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        enum: allowedGenre
    }
}, { timestamps: true })

const Genre = mongoose.model('Genre', GenreSchema);
export default Genre;
