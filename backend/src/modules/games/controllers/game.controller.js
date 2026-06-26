import Game from '../models/game.model.js';
import {
  createGameValidator,
  updateGameValidator,
  patchGameValidator,
  listQueryValidator
} from '../validators/game.validator.js';
import {
  PUBLIC_FILTER,
  ON_SALE_FILTER,
  buildListFilter,
  buildSortOptions,
  paginateGames,
  toCardShape,
  toDetailShape,
  getSlugNeighbors,
  prepareGamePayload
} from '../services/game.service.js';

const sendListResponse = (res, { games, total, page, limit, totalPages }, message) =>
  res.status(200).json({
    success: true,
    message,
    data: games.map(toCardShape),
    meta: { page, limit, total, totalPages }
  });

const sendEmptyListResponse = (res, page, limit, message) =>
  res.status(200).json({
    success: true,
    message,
    data: [],
    meta: { page, limit, total: 0, totalPages: 0 }
  });

export const getGames = async (req, res) => {
  try {
    const { error, value } = listQueryValidator(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message).join(', ')
      });
    }

    const { page, limit, sort } = value;
    const { filter, hasTextSearch } = await buildListFilter(value);

    if (!filter) {
      return sendEmptyListResponse(res, page, limit, 'Games Fetched Successfully');
    }

    const sortOptions = buildSortOptions(sort, hasTextSearch);
    const result = await paginateGames(filter, sortOptions, page, limit);

    return sendListResponse(res, result, 'Games Fetched Successfully');
  } catch (error) {
    console.log('Error in Get Games Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Get Games Controller',
      error: error.message
    });
  }
};

export const getOnSaleGames = async (req, res) => {
  try {
    const { error, value } = listQueryValidator(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message).join(', ')
      });
    }

    const { page, limit, sort } = value;
    const { filter, hasTextSearch } = await buildListFilter(value, { salesOnly: true });

    if (!filter) {
      return sendEmptyListResponse(res, page, limit, 'On-sale games fetched successfully');
    }

    const sortOptions = buildSortOptions(sort, hasTextSearch);
    const result = await paginateGames(filter, sortOptions, page, limit);

    return sendListResponse(res, result, 'On-sale games fetched successfully');
  } catch (error) {
    console.log('Error in Get On Sale Games Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Get On Sale Games Controller',
      error: error.message
    });
  }
};

export const getOnSaleCount = async (req, res) => {
  try {
    const count = await Game.countDocuments({
      ...PUBLIC_FILTER,
      ...ON_SALE_FILTER
    });

    return res.status(200).json({
      success: true,
      message: 'On-sale count fetched successfully',
      data: { count }
    });
  } catch (error) {
    console.log('Error in Get On Sale Count Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Get On Sale Count Controller',
      error: error.message
    });
  }
};

export const getTopSellers = async (req, res) => {
  try {
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 5));

    const games = await Game.aggregate([
      { $match: PUBLIC_FILTER },
      {
        $addFields: {
          isHot: { $cond: [{ $in: ['Hot', '$tags'] }, 1, 0] }
        }
      },
      { $sort: { isHot: -1, rating: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'genres',
          localField: 'genre',
          foreignField: '_id',
          as: 'genre'
        }
      },
      { $unwind: '$genre' },
      {
        $project: {
          id: 1,
          title: 1,
          price: 1,
          oldPrice: 1,
          rating: 1,
          tags: 1,
          coverImage: 1,
          detailedDescription: { topGalleryImages: 1 },
          genre: { name: '$genre.name' }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      message: 'Top sellers fetched successfully',
      data: games.map(toCardShape)
    });
  } catch (error) {
    console.log('Error in Get Top Sellers Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Get Top Sellers Controller',
      error: error.message
    });
  }
};

export const getRelatedGames = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const currentGame = await Game.findOne({ id: slug, ...PUBLIC_FILTER })
      .select('genre id')
      .lean();

    if (!currentGame) {
      return res.status(404).json({
        success: false,
        message: 'Game Not Found'
      });
    }

    let relatedGames = await Game.find({
      ...PUBLIC_FILTER,
      genre: currentGame.genre,
      id: { $ne: slug }
    })
      .populate('genre', 'name')
      .limit(4)
      .lean();

    if (relatedGames.length === 0) {
      relatedGames = await Game.find({
        ...PUBLIC_FILTER,
        id: { $ne: slug }
      })
        .populate('genre', 'name')
        .limit(4)
        .lean();
    }

    return res.status(200).json({
      success: true,
      message: 'Related games fetched successfully',
      data: relatedGames.map(toCardShape)
    });
  } catch (error) {
    console.log('Error in Get Related Games Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Get Related Games Controller',
      error: error.message
    });
  }
};

export const getGameBySlug = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const game = await Game.findOne({ id: slug, ...PUBLIC_FILTER })
      .populate('genre', 'name')
      .lean();

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game Not Found'
      });
    }

    const { prevGameId, nextGameId } = await getSlugNeighbors(slug);

    return res.status(200).json({
      success: true,
      message: 'Game fetched successfully',
      data: {
        game: toDetailShape(game),
        prevGameId,
        nextGameId
      }
    });
  } catch (error) {
    console.log('Error in Get Game By Slug Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Get Game By Slug Controller',
      error: error.message
    });
  }
};

export const createGame = async (req, res) => {
  try {
    const { error, value } = createGameValidator(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message).join(', ')
      });
    }

    const exists = await Game.findOne({ id: value.id }).select('_id').lean();
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Game slug already exists'
      });
    }

    const { payload, error: genreError } = await prepareGamePayload(value);
    if (genreError) {
      return res.status(400).json({
        success: false,
        message: genreError
      });
    }

    const game = await Game.create(payload);
    const populated = await Game.findById(game._id).populate('genre', 'name').lean();

    return res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: toDetailShape(populated)
    });
  } catch (error) {
    console.log('Error in Create Game Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Create Game Controller',
      error: error.message
    });
  }
};

export const updateGame = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const existing = await Game.findOne({ id: slug }).select('_id').lean();
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Game Not Found'
      });
    }

    const { error, value } = updateGameValidator(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message).join(', ')
      });
    }

    const { payload, error: genreError } = await prepareGamePayload(value);
    if (genreError) {
      return res.status(400).json({
        success: false,
        message: genreError
      });
    }

    const updated = await Game.findOneAndUpdate(
      { id: slug },
      payload,
      { new: true, runValidators: true }
    )
      .populate('genre', 'name')
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Game updated successfully',
      data: toDetailShape(updated)
    });
  } catch (error) {
    console.log('Error in Update Game Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Update Game Controller',
      error: error.message
    });
  }
};

export const patchGame = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const { error, value } = patchGameValidator(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message).join(', ')
      });
    }

    const updated = await Game.findOneAndUpdate(
      { id: slug },
      { $set: value },
      { new: true, runValidators: true }
    )
      .populate('genre', 'name')
      .lean();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Game Not Found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Game patched successfully',
      data: toDetailShape(updated)
    });
  } catch (error) {
    console.log('Error in Patch Game Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Patch Game Controller',
      error: error.message
    });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();

    const deleted = await Game.findOneAndUpdate(
      { id: slug },
      { isDeleted: true, isActive: false },
      { new: true }
    )
      .select('id title')
      .lean();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Game Not Found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Game deleted successfully',
      data: { id: deleted.id, title: deleted.title }
    });
  } catch (error) {
    console.log('Error in Delete Game Controller : ', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error in Delete Game Controller',
      error: error.message
    });
  }
};
