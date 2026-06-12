import Joi from "joi";

export const allowedGenre = ['Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Racing', 'Fighting', 'Horror']

export const addGenreValidator = (data) => {
    const schema = Joi.object({
        name: Joi
            .string()
            .trim()
            .required()
            .default('All Games')
            .valid(...allowedGenre)
            .messages({
                'any.only': `Genre must be one of: ${allowedGenre.join(', ')}`,
                'any.required': 'Genre name is required.',
                'string.empty': 'Genre name cannot be empty.'
            })
    })
    return schema.validate(data, { abortEarly: false });
}