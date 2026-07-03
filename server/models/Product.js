import mongoose from 'mongoose';

const specificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    specifications: [specificationSchema],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    popularity: { type: Number, default: 0 },
  },
  { timestamps: true },
);

productSchema.index({ title: 'text', description: 'text', brand: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
