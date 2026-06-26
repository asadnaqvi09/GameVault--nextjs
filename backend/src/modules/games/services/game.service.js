import Genre from '../../genre/models/genre.model.js';
import Game from '../models/game.model.js';

export const PUBLIC_FILTER = { isActive: true, isDeleted: false };

export const ON_SALE_FILTER = {
  oldPrice: { $exists: true, $ne: null },
  $expr: { $lt: ['$price', '$oldPrice'] }
};

export const normalizeGameMode = (gameMode) => {
  if (!gameMode) return [];
  if (Array.isArray(gameMode)) return gameMode.map((m) => m.trim()).filter(Boolean);
  return String(gameMode).split(',').map((m) => m.trim()).filter(Boolean);
};

export const resolveGenreId = async (genreName) => {
  if (!genreName) return null;
  const genre = await Genre.findOne({
    name: { $regex: new RegExp(`^${genreName}$`, 'i') }
  }).select('_id').lean();
  return genre?._id ?? null;
};

export const getCoverImage = (game) =>
  game.coverImage ||
  game.detailedDescription?.topGalleryImages?.[0] ||
  null;

export const calcDiscountPercent = (price, oldPrice) => {
  if (!oldPrice || price >= oldPrice) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

export const formatReleaseDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split('T')[0];
};

export const toCardShape = (game) => ({
  id: game.id,
  title: game.title,
  price: game.price,
  oldPrice: game.oldPrice ?? null,
  rating: game.rating,
  tags: game.tags || [],
  genre: game.genre?.name ?? game.genre,
  image: getCoverImage(game),
  discountPercent: calcDiscountPercent(game.price, game.oldPrice)
});

export const toDetailShape = (game) => ({
  id: game.id,
  title: game.title,
  price: game.price,
  oldPrice: game.oldPrice ?? null,
  rating: game.rating,
  reviewCount: game.reviewCount,
  tags: game.tags || [],
  smallDescription: game.smallDescription,
  coverImage: getCoverImage(game),
  genre: game.genre?.name ?? game.genre,
  gameMode: Array.isArray(game.gameMode)
    ? game.gameMode.join(', ')
    : game.gameMode,
  ageRestrictionBadge: game.ageRestrictionBadge,
  options: game.options,
  specifications: {
    ...game.specifications,
    releaseDate: formatReleaseDate(game.specifications?.releaseDate)
  },
  detailedDescription: game.detailedDescription
});

export const buildSortOptions = (sort, hasTextSearch = false) => {
  if (hasTextSearch) {
    return { score: { $meta: 'textScore' } };
  }
  switch (sort) {
    case 'low-to-high':
      return { price: 1 };
    case 'high-to-low':
      return { price: -1 };
    case 'average-rating':
      return { rating: -1 };
    case 'latest':
      return { 'specifications.releaseDate': -1 };
    default:
      return { createdAt: -1 };
  }
};

export const buildListFilter = async (query, { salesOnly = false } = {}) => {
  const {
    genre,
    platform,
    language,
    minPrice,
    maxPrice,
    stock_status,
    tags,
    search
  } = query;
  const filter = {
    ...PUBLIC_FILTER,
    price: { $gte: minPrice, $lte: maxPrice }
  };
  if (genre) {
    const genreId = await resolveGenreId(genre);
    if (!genreId) {
      return { filter: null, hasTextSearch: false };
    }
    filter.genre = genreId;
  }
  if (platform) {
    filter['options.platforms'] = {
      $regex: new RegExp(`^${platform}$`, 'i')
    };
  }
  if (language) {
    filter['specifications.languages'] = {
      $regex: new RegExp(language, 'i')
    };
  }
  if (salesOnly || stock_status === 'onsale') {
    Object.assign(filter, ON_SALE_FILTER);
  }
  if (tags) {
    const tagList = String(tags).split(',').map((t) => t.trim()).filter(Boolean);
    if (tagList.length) {
      filter.tags = { $in: tagList };
    }
  }
  const hasTextSearch = Boolean(search?.trim());
  if (hasTextSearch) {
    filter.$text = { $search: search.trim() };
  }
  return { filter, hasTextSearch };
};

export const paginateGames = async (filter, sort, page, limit) => {
  const skip = (page - 1) * limit;
  let findQuery = Game.find(filter)
    .populate('genre', 'name')
    .sort(sort)
    .skip(skip)
    .limit(limit);
  if (sort.score) {
    findQuery = findQuery.select({ score: { $meta: 'textScore' } });
  } else {
    findQuery = findQuery.select('-detailedDescription.features');
  }
  findQuery = findQuery.lean();
  const [games, total] = await Promise.all([
    findQuery,
    Game.countDocuments(filter)
  ]);
  return {
    games,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 0
  };
};

export const getSlugNeighbors = async (slug) => {
  const slugs = await Game.find(PUBLIC_FILTER)
    .sort({ title: 1 })
    .select('id')
    .lean();
  const index = slugs.findIndex((g) => g.id === slug);
  return {
    prevGameId: index > 0 ? slugs[index - 1].id : null,
    nextGameId: index >= 0 && index < slugs.length - 1 ? slugs[index + 1].id : null
  };
};

export const prepareGamePayload = async (value) => {
  const genreId = await resolveGenreId(value.genre);
  if (!genreId) {
    return { error: 'Invalid genre' };
  }
  const { genre: _genreName, ...rest } = value;
  return {
    payload: {
      ...rest,
      genre: genreId,
      gameMode: normalizeGameMode(value.gameMode),
      coverImage: value.coverImage || value.detailedDescription?.topGalleryImages?.[0] || null
    }
  };
};
