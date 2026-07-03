import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const buildProductFilter = async (query) => {
  const filter = {};
  const search = query.q || query.search;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
    ];
  }

  if (query.category) {
    if (mongoose.isValidObjectId(query.category)) {
      filter.category = query.category;
    } else {
      const category = await Category.findOne({ name: { $regex: `^${query.category}$`, $options: 'i' } });
      if (category) filter.category = category._id;
    }
  }

  if (query.brand) {
    filter.brand = { $in: String(query.brand).split(',').map((brand) => new RegExp(`^${brand.trim()}$`, 'i')) };
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.rating) {
    filter.rating = { $gte: Number(query.rating) };
  }

  if (query.seller) {
    filter.seller = query.seller;
  }

  return filter;
};

const sortMap = {
  price_asc: { discountPrice: 1, price: 1 },
  price_desc: { discountPrice: -1, price: -1 },
  newest: { createdAt: -1 },
  popularity: { popularity: -1, numReviews: -1 },
  discount: { discountPrice: 1, createdAt: -1 },
};

const sendProducts = async (req, res, extraQuery = {}) => {
  const query = { ...req.query, ...extraQuery };
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Number(query.limit) || 12, 48);
  const skip = (page - 1) * limit;
  const filter = await buildProductFilter(query);
  const sort = sortMap[query.sort] || sortMap.newest;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name image')
      .populate('seller', 'name email role')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({
    products,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    total,
  });
};

export const getProducts = asyncHandler(async (req, res) => {
  await sendProducts(req, res);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name image description')
    .populate('seller', 'name email role');

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  product.popularity += 1;
  await product.save();

  res.json(product);
});

export const searchProducts = asyncHandler(async (req, res) => {
  await sendProducts(req, res, { search: req.query.q || req.query.search });
});

export const getProductsByCategory = asyncHandler(async (req, res) => {
  await sendProducts(req, res, { category: req.params.categoryId });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    discountPrice: req.body.discountPrice || req.body.price,
    category: req.body.category,
    brand: req.body.brand,
    stock: req.body.stock,
    images: req.body.images || [],
    specifications: req.body.specifications || [],
    seller: req.user._id,
  });

  res.status(201).json(await product.populate(['category', 'seller']));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  const editableFields = [
    'title',
    'description',
    'price',
    'discountPrice',
    'category',
    'brand',
    'stock',
    'images',
    'specifications',
  ];

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  await product.save();
  res.json(await product.populate(['category', 'seller']));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  await product.deleteOne();
  res.json({ message: 'Product deleted successfully.' });
});
