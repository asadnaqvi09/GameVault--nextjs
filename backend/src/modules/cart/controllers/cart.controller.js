import {
  addCartItemValidator,
  updateCartItemValidator
} from '../validators/cart.validator.js';
import {
  getUserCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearUserCart
} from '../services/cart.service.js';

const joiError = (res, error) =>
  res.status(400).json({
    success: false,
    message: error.details.map((e) => e.message).join(', ')
  });

const clientError = (res, message, status = 400) =>
  res.status(status).json({ success: false, message });

export const getCart = async (req, res) => {
  try {
    const data = await getUserCart(req.user._id);
    return res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      data
    });
  } catch (err) {
    console.log('Error in Get Cart Controller : ', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: err.message
    });
  }
};

export const addCartItem = async (req, res) => {
  try {
    const { error, value } = addCartItemValidator(req.body);
    if (error) return joiError(res, error);
    const data = await addItemToCart(req.user._id, value);
    return res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data
    });
  } catch (err) {
    console.log('Error in Add Cart Item Controller : ', err.message);
    if (['Game not found', 'Please select a platform', 'Please select an edition', 'Invalid platform selected', 'Invalid edition selected'].includes(err.message)) {
      return clientError(res, err.message);
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: err.message
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { error, value } = updateCartItemValidator(req.body);
    if (error) return joiError(res, error);
    const data = await updateCartItemQuantity(req.user._id, req.params.itemId, value.quantity);
    return res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data
    });
  } catch (err) {
    console.log('Error in Update Cart Item Controller : ', err.message);
    if (err.message === 'Cart item not found') {
      return clientError(res, err.message, 404);
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: err.message
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const data = await removeCartItem(req.user._id, req.params.itemId);
    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data
    });
  } catch (err) {
    console.log('Error in Delete Cart Item Controller : ', err.message);
    if (err.message === 'Cart item not found') {
      return clientError(res, err.message, 404);
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to remove item',
      error: err.message
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const data = await clearUserCart(req.user._id);
    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data
    });
  } catch (err) {
    console.log('Error in Clear Cart Controller : ', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: err.message
    });
  }
};
