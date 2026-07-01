'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/admin/ui/Modal';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import { methodLabels } from '@/lib/admin/orderConstants';
import {
  approveAdminOrder,
  rejectAdminOrder,
  confirmCodAdminOrder,
  fulfillAdminOrder,
  cancelAdminOrder,
} from '@/lib/api/adminOrderApi';

export default function OrderDetailModal({
  open,
  order,
  loading,
  onClose,
  onRefresh,
  showToast,
}) {
  const [action, setAction] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [fulfillKeys, setFulfillKeys] = useState([]);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (!order) return;
    setRejectReason('');
    setAdminNotes('');
    setFulfillKeys(
      (order.items || []).map((item) => ({
        gameId: item.gameId,
        title: item.title,
        key: '',
      }))
    );
    setAction(null);
  }, [order]);

  if (!order) return null;

  const runAction = async (fn, successMsg) => {
    setSubmitting(true);
    try {
      await fn();
      showToast(successMsg);
      setAction(null);
      await onRefresh();
      onClose();
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = () =>
    runAction(() => approveAdminOrder(order.id), 'Payment approved');

  const handleConfirmCod = () =>
    runAction(() => confirmCodAdminOrder(order.id), 'COD payment confirmed');

  const handleCancel = () =>
    runAction(() => cancelAdminOrder(order.id), 'Order cancelled');

  const handleReject = () => {
    if (rejectReason.trim().length < 10) {
      showToast('Rejection reason must be at least 10 characters', 'error');
      return;
    }
    runAction(() => rejectAdminOrder(order.id, rejectReason.trim()), 'Payment rejected');
  };

  const handleFulfill = () => {
    const keys = fulfillKeys
      .filter((k) => k.key.trim())
      .map((k) => ({ gameId: k.gameId, key: k.key.trim() }));
    if (!keys.length) {
      showToast('At least one game key is required', 'error');
      return;
    }
    runAction(
      () => fulfillAdminOrder(order.id, { keys, adminNotes: adminNotes.trim() || undefined }),
      'Order fulfilled'
    );
  };

  const canApprove = order.status === 'payment_under_review';
  const canReject = order.status === 'payment_under_review';
  const canConfirmCod = order.status === 'pending_payment' && order.paymentMethod === 'cod';
  const canFulfill = order.status === 'paid';
  const canCancel = ['pending_payment', 'payment_under_review'].includes(order.status);

  const payment = order.paymentDetail || order.payment;
  const proofUrl = payment?.proofImageUrl;
  const isManualMethod = order.paymentMethod === 'jazzcash' || order.paymentMethod === 'easypaisa';
  const showPaymentSection = isManualMethod || !!payment;

  return (
    <>
      <Modal open={open} onClose={onClose} title={`Order ${order.orderNumber}`} size="lg">
        {loading ? (
          <p className="text-sm text-gray-400 py-8 text-center">Loading order details...</p>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={order.status} />
              <span className="text-sm text-gray-500">
                {methodLabels[order.paymentMethod] || order.paymentMethod}
              </span>
              <span className="text-sm font-bold text-gray-900">
                PKR {order.total?.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Customer</h3>
              <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
                <p className="font-semibold text-gray-900">{order.user?.userName || '—'}</p>
                <p className="text-gray-600">{order.user?.email || order.billingDetails?.email}</p>
                {order.billingDetails && (
                  <p className="text-gray-500 pt-2">
                    {order.billingDetails.firstName} {order.billingDetails.lastName} ·{' '}
                    {order.billingDetails.phone}
                    <br />
                    {order.billingDetails.streetAddress}, {order.billingDetails.city},{' '}
                    {order.billingDetails.province} {order.billingDetails.zipCode}
                  </p>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Items</h3>
              <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-400">
                        Qty {item.quantity}
                        {item.platform ? ` · ${item.platform}` : ''}
                        {item.edition ? ` · ${item.edition}` : ''}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {showPaymentSection && (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Payment</h3>
                <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                  {!payment && (
                    <p className="text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs">
                      Payment record is missing. This order may have been created before upload completed.
                    </p>
                  )}
                  {payment?.transactionId && (
                    <p>
                      <span className="text-gray-500">Transaction ID:</span>{' '}
                      <span className="font-mono font-semibold">{payment.transactionId}</span>
                    </p>
                  )}
                  {payment?.senderNumber && (
                    <p>
                      <span className="text-gray-500">Sender:</span> {payment.senderNumber}
                    </p>
                  )}
                  {proofUrl ? (
                    <div className="pt-2">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="text-gray-500">Payment proof</p>
                        <a
                          href={proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-[#5B42F3] hover:underline cursor-pointer"
                        >
                          Open full image
                        </a>
                      </div>
                      <a
                        href={proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block cursor-pointer"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={proofUrl}
                          alt="Payment proof"
                          className="rounded-lg border border-gray-200 object-cover max-h-52 w-auto max-w-full"
                        />
                      </a>
                    </div>
                  ) : isManualMethod ? (
                    <p className="text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs">
                      No payment screenshot on file. Ask the customer to resubmit proof or cancel this order.
                    </p>
                  ) : null}
                </div>
              </section>
            )}

            {order.rejectionReason && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-xs font-bold text-red-600 uppercase mb-1">Rejection reason</p>
                <p className="text-sm text-red-700">{order.rejectionReason}</p>
              </div>
            )}

            {order.fulfillment?.keys?.length > 0 && (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Fulfilled keys</h3>
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 space-y-2">
                  {order.fulfillment.keys.map((k, idx) => (
                    <div key={idx}>
                      <p className="text-xs text-gray-500">{k.title}</p>
                      <p className="text-sm font-mono font-bold text-gray-900">{k.key}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              {canApprove && (
                <button
                  type="button"
                  onClick={() => setAction('approve')}
                  className="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer transition-colors"
                >
                  Approve payment
                </button>
              )}
              {canReject && (
                <button
                  type="button"
                  onClick={() => setAction('reject')}
                  className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer transition-colors"
                >
                  Reject payment
                </button>
              )}
              {canConfirmCod && (
                <button
                  type="button"
                  onClick={() => setAction('confirm-cod')}
                  className="px-4 py-2 text-sm font-semibold bg-[#5B42F3] hover:bg-[#4a35d9] text-white rounded-lg cursor-pointer transition-colors"
                >
                  Confirm COD
                </button>
              )}
              {canFulfill && (
                <button
                  type="button"
                  onClick={() => setAction('fulfill')}
                  className="px-4 py-2 text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-colors"
                >
                  Fulfill order
                </button>
              )}
              {canCancel && (
                <button
                  type="button"
                  onClick={() => setAction('cancel')}
                  className="px-4 py-2 text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                >
                  Cancel order
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={action === 'approve'}
        onClose={() => setAction(null)}
        onConfirm={handleApprove}
        title="Approve payment"
        message="Confirm that the manual payment has been verified. The order will move to Paid status."
        confirmLabel="Approve"
        variant="primary"
        loading={submitting}
      />

      <ConfirmDialog
        open={action === 'confirm-cod'}
        onClose={() => setAction(null)}
        onConfirm={handleConfirmCod}
        title="Confirm COD"
        message="Confirm cash on delivery payment for this order?"
        confirmLabel="Confirm COD"
        variant="primary"
        loading={submitting}
      />

      <ConfirmDialog
        open={action === 'cancel'}
        onClose={() => setAction(null)}
        onConfirm={handleCancel}
        title="Cancel order"
        message="This will cancel the order. This action cannot be undone."
        confirmLabel="Cancel order"
        variant="danger"
        loading={submitting}
      />

      <Modal open={action === 'reject'} onClose={() => setAction(null)} title="Reject payment" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Provide a reason for the customer (min 10 characters).</p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5B42F3] resize-none"
            placeholder="Payment proof does not match..."
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setAction(null)}
              className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={submitting}
              className="px-4 py-2.5 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Please wait...' : 'Reject payment'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={action === 'fulfill'} onClose={() => setAction(null)} title="Fulfill order" size="md">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Enter game keys for each line item.</p>
          {fulfillKeys.map((item, idx) => (
            <div key={item.gameId}>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{item.title}</label>
              <input
                type="text"
                value={item.key}
                onChange={(e) => {
                  const next = [...fulfillKeys];
                  next[idx] = { ...next[idx], key: e.target.value };
                  setFulfillKeys(next);
                }}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#5B42F3]"
                placeholder="XXXX-XXXX-XXXX"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Admin notes (optional)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={2}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5B42F3] resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAction(null)}
              className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleFulfill}
              disabled={submitting}
              className="px-4 py-2.5 text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Please wait...' : 'Fulfill order'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
