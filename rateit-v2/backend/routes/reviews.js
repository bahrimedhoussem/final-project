const express     = require('express');
const router      = express.Router();
const Review      = require('../models/Review');
const { protect } = require('../middleware/auth');

router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (e) { res.status(500).json({ message: 'Erreur serveur' }); }
});

router.post('/:productId', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: 'Note entre 1 et 5 requise' });
    const review = await Review.create({ product: req.params.productId, user: req.user.id, rating: Number(rating), comment });
    await review.populate('user', 'name');
    res.status(201).json(review);
  } catch (e) { res.status(500).json({ message: 'Erreur serveur', error: e.message }); }
});

module.exports = router;
