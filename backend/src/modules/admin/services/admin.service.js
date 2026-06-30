import Order from '../../orders/models/order.model.js';
import Game from '../../games/models/game.model.js';
import Contact from '../../contact/models/contact.model.js';
import Review from '../../reviews/models/review.model.js';
import { ORDER_STATUS } from '../../../shared/constants/order.constants.js';

export const getDashboardStatsData = async () => {
  const [
    pendingReview,
    pendingCod,
    awaitingFulfillment,
    totalOrders,
    totalGames,
    pendingContacts,
    unapprovedReviews,
    recentOrders,
  ] = await Promise.all([
    Order.countDocuments({ status: ORDER_STATUS.PAYMENT_UNDER_REVIEW }),
    Order.countDocuments({ status: ORDER_STATUS.PENDING_PAYMENT, paymentMethod: 'cod' }),
    Order.countDocuments({ status: ORDER_STATUS.PAID }),
    Order.countDocuments(),
    Game.countDocuments({ isDeleted: false }),
    Contact.countDocuments({ status: 'pending' }),
    Review.countDocuments({ isApproved: false, isDeleted: false }),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'userName email')
      .select('orderNumber status total paymentMethod createdAt user')
      .lean(),
  ]);
  return {
    pendingReview,
    pendingCod,
    awaitingFulfillment,
    totalOrders,
    totalGames,
    pendingContacts,
    unapprovedReviews,
    recentOrders: recentOrders.map((o) => ({
      id: o._id,
      orderNumber: o.orderNumber,
      status: o.status,
      total: o.total,
      paymentMethod: o.paymentMethod,
      createdAt: o.createdAt,
      user: o.user,
    })),
  };
};
