import genre from '../models/genre.model.js';
import Game from '../../games/models/game.model.js';
import { genreValidator } from '../validators/genre.validator.js';

export const getAllGenre = async (req, res) => {
    try {
        const genres = await genre.find().lean();
        return res.status(200).json({
            success: true,
            message: "Genres Fetched Successfully",
            data: genres
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error to get all genre',
            error: error.message,
        });
    }
};

export const addGenre = async (req, res) => {
    try {
        const { error, value } = genreValidator(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message).join(', ')
            });
        }
        const { name } = value;
        const isExistGenre = await genre.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } }); 
        if (isExistGenre) {
            return res.status(400).json({
                success: false,
                message: "Genre Name already exists"
            });
        }
        const newGenre = await genre.create({ name });
        return res.status(201).json({
            success: true,
            message: "Genre Added Successfully",
            data: newGenre
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error to add genre",
            error: error.message,
        });
    }
};

export const updateGenre = async (req, res) => {
    try {
        const { id } = req.params;
        const { error, value } = genreValidator(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message).join(', ')
            });
        }
        const { name } = value;
        const duplicateCheck = await genre.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            _id: { $ne: id }
        });

        if (duplicateCheck) {
            return res.status(400).json({
                success: false,
                message: "Another genre with this name already exists"
            });
        }
        const updatedGenre = await genre.findByIdAndUpdate(
            id, 
            { name }, 
            { new: true, runValidators: true }
        );
        if (!updatedGenre) {
            return res.status(404).json({
                success: false,
                message: "Genre Not Found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Genre Updated Successfully",
            data: updatedGenre
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error to update genre",
            error: error.message,
        });
    }
};

export const deleteGenre = async (req, res) => {
    try {
        const { id } = req.params;
        const genreDoc = await genre.findById(id);
        if (!genreDoc) {
            return res.status(404).json({
                success: false,
                message: "Genre Not Found"
            });
        }
        const gamesUsingGenre = await Game.countDocuments({ genre: id, isDeleted: false });
        if (gamesUsingGenre > 0) {
            return res.status(409).json({
                success: false,
                message: `Cannot delete genre used by ${gamesUsingGenre} game(s)`
            });
        }
        await genre.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Genre Deleted Successfully",
            data: { id: genreDoc._id, name: genreDoc.name }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error to delete genre",
            error: error.message,
        });
    }
};
