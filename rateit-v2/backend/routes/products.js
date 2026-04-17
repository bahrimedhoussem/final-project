const express               = require('express');
const router                = express.Router();
const Product               = require('../models/Product');
const Review                = require('../models/Review');
const { protect, adminOnly} = require('../middleware/auth');

const withRating = async (product) => {
  const reviews = await Review.find({ product: product._id });
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;
  return { ...product.toObject(), avgRating: Number(avg), reviewCount: reviews.length };
};

router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category && category !== 'Tous') query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    const products = await Product.find(query).populate('createdBy', 'name').sort({ createdAt: -1 });
    const result = await Promise.all(products.map(withRating));
    res.json(result);
  } catch (e) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalReviews  = await Review.countDocuments();
    const allReviews    = await Review.find();
    const avgRating     = allReviews.length
      ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1) : 0;
    const products      = await Product.find();
    const withRatings   = await Promise.all(products.map(withRating));
    const topProducts   = withRatings.filter(p => p.reviewCount > 0).sort((a, b) => b.avgRating - a.avgRating).slice(0, 3);
    const byCategory    = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
    res.json({ totalProducts, totalReviews, avgRating: Number(avgRating), topProducts, byCategory });
  } catch (e) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).populate('createdBy', 'name');
    if (!p) return res.status(404).json({ message: 'Produit non trouve' });
    res.json(await withRating(p));
  } catch (e) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    const product = await Product.create({ name, description, price, category, image: image || '', createdBy: req.user.id });
    res.status(201).json(product);
  } catch (e) { res.status(500).json({ message: 'Erreur serveur', error: e.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { name, description, price, category, image }, { new: true });
    if (!product) return res.status(404).json({ message: 'Produit non trouve' });
    res.json(product);
  } catch (e) { res.status(500).json({ message: 'Erreur serveur', error: e.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: 'Produit non trouve' });
    await Review.deleteMany({ product: req.params.id });
    res.json({ message: 'Produit supprime' });
  } catch (e) { res.status(500).json({ message: 'Erreur serveur' }); }
});

module.exports = router;
