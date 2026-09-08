import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  image: string;
  images: string[];
  brand: string;
  category: string;
  subcategory?: string;
  description: string;
  sku: string;
  hsn: string;
  gstRate: number;
  mrp: number;
  price: number;
  discount: number;
  countInStock: number;
  weight: number; // in kg
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  sizes: string[];
  colors: string[];
  tags: string[];
  sellerId?: mongoose.Types.ObjectId;
  sellerName?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  commissionRate: number;
  rating: number;
  numReviews: number;
  featured?: boolean;
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    default: 'Fashion',
  },
  subcategory: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    default: () => 'SKU-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
  },
  hsn: {
    type: String,
    default: '6203',
  },
  gstRate: {
    type: Number,
    default: 12,
  },
  mrp: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 10,
  },
  weight: {
    type: Number,
    default: 0.5, // 500g default
  },
  dimensions: {
    length: { type: Number, default: 20 },
    width: { type: Number, default: 15 },
    height: { type: Number, default: 5 },
  },
  sizes: [{
    type: String,
  }],
  colors: [{
    type: String,
  }],
  tags: [{
    type: String,
  }],
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  sellerName: {
    type: String,
    default: 'OneStall Direct Store',
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved',
  },
  commissionRate: {
    type: Number,
    default: 10, // Default 10%
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  numReviews: {
    type: Number,
    default: 12,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
