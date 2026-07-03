import Category from '../models/Category.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    res.status(404);
    throw new Error('Category not found.');
  }

  res.json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found.');
  }

  res.json({ message: 'Category deleted successfully.' });
});
