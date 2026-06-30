'use client';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setCart, setCartLoading, resetCart } from '@/store/slices/cartSlice';
import * as cartAPI from '@/store/api/cartApi';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';

export function useCart() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { items, itemCount, subtotal, total, isLoading } = useSelector((s) => s.cart);

  const syncCart = useCallback((data) => {
    dispatch(setCart(data));
  }, [dispatch]);

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) return;
    dispatch(setCartLoading(true));
    try {
      const res = await cartAPI.fetchCart();
      syncCart(res.data);
    } catch {
      dispatch(setCartLoading(false));
    }
  }, [isAuthenticated, dispatch, syncCart]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      dispatch(resetCart());
    }
  }, [isAuthenticated, loadCart, dispatch]);

  const requireAuth = () => {
    showToast('Please log in to use your cart', 'error');
    router.push('/auth');
    return false;
  };

  const addToCart = async (product) => {
    if (!isAuthenticated) return requireAuth();
    try {
      const res = await cartAPI.addCartItem({
        gameId: product.gameId || product.id,
        quantity: product.quantity || 1,
        platform: product.platform || null,
        edition: product.edition || null,
      });
      syncCart(res.data);
      showToast(`${product.title} added to cart`);
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to add to cart', 'error');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isAuthenticated) return;
    try {
      const res = await cartAPI.updateCartItem(itemId, { quantity });
      syncCart(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to update quantity', 'error');
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) return;
    try {
      const res = await cartAPI.removeCartItem(itemId);
      syncCart(res.data);
      showToast('Item removed from cart');
    } catch (err) {
      showToast(err.message || 'Failed to remove item', 'error');
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await cartAPI.clearCartApi();
      syncCart(res.data);
    } catch {
      dispatch(resetCart());
    }
  };

  return {
    cartItems: items,
    cartCount: itemCount,
    cartTotal: total,
    cartSubtotal: subtotal,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: loadCart,
  };
}
