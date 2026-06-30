import Cart from '../models/cart.model.js';
import Game from '../../games/models/game.model.js';
import { getCoverImage } from '../../games/services/game.service.js';

const PUBLIC_FILTER = { isActive: true, isDeleted: false };

export const findOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const matchItem = (item, gameId, platform, edition) =>
  item.gameId === gameId &&
  (item.platform || null) === (platform || null) &&
  (item.edition || null) === (edition || null);

export const validateGameOptions = (game, platform, edition) => {
  const platforms = game.options?.platforms || [];
  const editions = game.options?.editions || [];
  if (platforms.length && !platform) {
    throw new Error('Please select a platform');
  }
  if (editions.length && !edition) {
    throw new Error('Please select an edition');
  }
  if (platform && platforms.length && !platforms.includes(platform)) {
    throw new Error('Invalid platform selected');
  }
  if (edition && editions.length && !editions.includes(edition)) {
    throw new Error('Invalid edition selected');
  }
};

export const resolveCart = async (cart) => {
  const gameIds = [...new Set(cart.items.map((i) => i.gameId))];
  const games = await Game.find({ id: { $in: gameIds } }).lean();
  const gameMap = new Map(games.map((g) => [g.id, g]));
  const items = [];
  let itemCount = 0;
  let subtotal = 0;
  for (const item of cart.items) {
    const game = gameMap.get(item.gameId);
    if (!game || !game.isActive || game.isDeleted) {
      items.push({
        id: item._id.toString(),
        gameId: item.gameId,
        title: game?.title || 'Unavailable game',
        price: game?.price || 0,
        oldPrice: game?.oldPrice ?? null,
        image: game ? getCoverImage(game) : null,
        quantity: item.quantity,
        platform: item.platform || null,
        edition: item.edition || null,
        lineTotal: 0,
        unavailable: true
      });
      continue;
    }
    const lineTotal = game.price * item.quantity;
    itemCount += item.quantity;
    subtotal += lineTotal;
    items.push({
      id: item._id.toString(),
      gameId: game.id,
      title: game.title,
      price: game.price,
      oldPrice: game.oldPrice ?? null,
      image: getCoverImage(game),
      quantity: item.quantity,
      platform: item.platform || null,
      edition: item.edition || null,
      lineTotal,
      unavailable: false
    });
  }
  return {
    id: cart._id,
    items,
    itemCount,
    subtotal,
    total: subtotal
  };
};

export const getUserCart = async (userId) => {
  const cart = await findOrCreateCart(userId);
  return resolveCart(cart);
};

export const addItemToCart = async (userId, payload) => {
  const game = await Game.findOne({ id: payload.gameId, ...PUBLIC_FILTER }).lean();
  if (!game) throw new Error('Game not found');
  const platform = payload.platform?.trim() || null;
  const edition = payload.edition?.trim() || null;
  validateGameOptions(game, platform, edition);
  const cart = await findOrCreateCart(userId);
  const existing = cart.items.find((item) => matchItem(item, payload.gameId, platform, edition));
  const addQty = payload.quantity || 1;
  if (existing) {
    existing.quantity = Math.min(10, existing.quantity + addQty);
  } else {
    cart.items.push({
      game: game._id,
      gameId: game.id,
      quantity: addQty,
      platform,
      edition
    });
  }
  await cart.save();
  return resolveCart(cart);
};

export const updateCartItemQuantity = async (userId, itemId, quantity) => {
  const cart = await findOrCreateCart(userId);
  const item = cart.items.id(itemId);
  if (!item) throw new Error('Cart item not found');
  item.quantity = quantity;
  await cart.save();
  return resolveCart(cart);
};

export const removeCartItem = async (userId, itemId) => {
  const cart = await findOrCreateCart(userId);
  const item = cart.items.id(itemId);
  if (!item) throw new Error('Cart item not found');
  item.deleteOne();
  await cart.save();
  return resolveCart(cart);
};

export const clearUserCart = async (userId) => {
  const cart = await findOrCreateCart(userId);
  cart.items = [];
  await cart.save();
  return resolveCart(cart);
};
