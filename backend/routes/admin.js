const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route GET /api/admin/stats
// @desc  Get dashboard stats
// @access Private
router.get('/stats', protect, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({});
    const availableProducts = await Product.countDocuments({ isAvailable: true });
    const featuredProducts = await Product.countDocuments({ featured: true });
    const trendingProducts = await Product.countDocuments({ trending: true });

    // Products by category
    const byCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent products (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentProducts = await Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Latest 5 products
    const latestProducts = await Product.find({}).sort('-createdAt').limit(5).select('name category images createdAt price');

    res.json({
      success: true,
      stats: {
        totalProducts,
        availableProducts,
        featuredProducts,
        trendingProducts,
        recentProducts,
        byCategory,
        latestProducts
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
