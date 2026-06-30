import { getDashboardStatsData } from '../services/admin.service.js';

export const getDashboardStats = async (_req, res) => {
  try {
    const data = await getDashboardStatsData();
    return res.status(200).json({
      success: true,
      message: 'Dashboard stats fetched',
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: err.message,
    });
  }
};
