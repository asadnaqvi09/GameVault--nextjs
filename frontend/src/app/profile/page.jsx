"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";

const statusStyles = {
  pending_payment: "bg-amber-100 text-amber-700",
  payment_under_review: "bg-blue-100 text-blue-700",
  paid: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  fulfilled: "bg-purple-100 text-purple-700",
  cancelled: "bg-gray-100 text-gray-600",
  expired: "bg-gray-100 text-gray-500",
};

const statusLabels = {
  pending_payment: "Pending Payment",
  payment_under_review: "Under Review",
  paid: "Paid",
  rejected: "Rejected",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
  expired: "Expired",
};

const methodLabels = {
  cod: "Cash on Delivery",
  jazzcash: "JazzCash",
  easypaisa: "EasyPaisa",
};

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { orders, isLoading, error, loadOrders, loadOrder, selectedOrder, cancelOrder } = useOrders();
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/auth?redirect=/profile");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders().catch(() => {});
    }
  }, [isAuthenticated, loadOrders]);

  const handleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    await loadOrder(id);
  };

  const handleCancel = async (id) => {
    try {
      await cancelOrder(id);
      await loadOrders();
    } catch {
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 pb-6 border-b border-gray-100">
        <h1 className="text-2xl font-black text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Signed in as <span className="font-semibold text-gray-800">{user?.userName}</span></p>
        <p className="text-sm text-gray-400">{user?.email}</p>
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Order History</h2>
      {isLoading && orders.length === 0 && (
        <p className="text-sm text-gray-400 py-8 text-center">Loading orders...</p>
      )}
      {error && (
        <p className="text-sm text-red-500 py-4">{error}</p>
      )}
      {!isLoading && orders.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Link href="/games" className="text-sm font-bold text-[#5B42F3] hover:underline">Browse games</Link>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {orders.map((order) => {
          const isOpen = expandedId === order.id;
          const detail = isOpen && selectedOrder?.id === order.id ? selectedOrder : order;
          return (
            <div key={order.id} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-xs">
              <button
                type="button"
                onClick={() => handleExpand(order.id)}
                className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 text-left hover:bg-gray-50/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-black text-gray-900">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyles[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                  <span className="text-sm font-bold text-gray-800">PKR {order.total?.toLocaleString()}</span>
                </div>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-gray-50 pt-4">
                  <p className="text-xs text-gray-500 mb-3">Payment: {methodLabels[detail.paymentMethod] || detail.paymentMethod}</p>
                  <div className="flex flex-col gap-2 mb-4">
                    {detail.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.title} × {item.quantity}</span>
                        <span className="font-semibold text-gray-900">PKR {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  {detail.rejectionReason && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
                      <p className="text-xs font-bold text-red-600 uppercase mb-1">Rejection reason</p>
                      <p className="text-sm text-red-700">{detail.rejectionReason}</p>
                    </div>
                  )}
                  {detail.fulfillment?.keys?.length > 0 && (
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 mb-4">
                      <p className="text-xs font-bold text-purple-600 uppercase mb-2">Your game keys</p>
                      {detail.fulfillment.keys.map((k, idx) => (
                        <div key={idx} className="mb-2 last:mb-0">
                          <p className="text-xs text-gray-500">{k.title}</p>
                          <p className="text-sm font-mono font-bold text-gray-900">{k.key}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {detail.payment?.transactionId && (
                    <p className="text-xs text-gray-400 mb-3">Transaction ID: {detail.payment.transactionId}</p>
                  )}
                  {order.status === "pending_payment" && order.paymentMethod === "cod" && (
                    <button
                      type="button"
                      onClick={() => handleCancel(order.id)}
                      className="text-xs font-bold text-red-500 hover:text-red-700"
                    >
                      Cancel order
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
