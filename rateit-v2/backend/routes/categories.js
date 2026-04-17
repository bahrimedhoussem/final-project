const express               = require('express');
const router                = express.Router();
const Category              = require('../models/Category');
const { protect, adminOnly} = require('../middleware/auth');

// GET /api/categories — toutes les catégories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (e) { res.status(500).json({ message: 'Erreur serveur' }); }
});

// POST /api/categories — créer une catégorie (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Nom requis' });
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) return res.status(400).json({ message: 'Catégorie déjà existante' });
    const category = await Category.create({ name: name.trim(), createdBy: req.user.id });
    res.status(201).json(category);
  } catch (e) { res.status(500).json({ message: 'Erreur serveur', error: e.message }); }
});

// DELETE /api/categories/:id — supprimer (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Catégorie supprimée' });
  } catch (e) { res.status(500).json({ message: 'Erreur serveur' }); }
});

module.exports = router;
