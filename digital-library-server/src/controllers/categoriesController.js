import { getAllCategories } from '../models/categoriesModel.js';

export async function listCategories(req, res) {
  try {
    const categories = await getAllCategories();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}