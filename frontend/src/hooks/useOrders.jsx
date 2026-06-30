'use client';
import { useCallback, useState } from 'react';
import { fetchMyOrders, fetchMyOrderById, cancelMyOrder } from '@/lib/api/orderApi';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchMyOrders(params);
      setOrders(res.data || []);
      setMeta(res.meta || null);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadOrder = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchMyOrderById(id);
      setSelectedOrder(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(async (id) => {
    const res = await cancelMyOrder(id);
    setOrders((prev) => prev.map((o) => (o.id === id ? res.data : o)));
    return res;
  }, []);

  return {
    orders,
    meta,
    selectedOrder,
    isLoading,
    error,
    loadOrders,
    loadOrder,
    cancelOrder,
  };
}
