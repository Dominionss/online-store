import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['fixed', 'percent'], default: 'fixed' },
    value: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date },
  },
  { timestamps: true },
);

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
