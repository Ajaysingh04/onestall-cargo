import mongoose from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  qty: number;
  sellerId?: mongoose.Types.ObjectId;
  sellerName?: string;
  commissionRate?: number;
  category?: string;
}

export interface IOrder extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderItems: IOrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  paymentMethod: 'COD' | 'UPI' | 'CARD' | 'WALLET';
  paymentResult?: {
    id: string;
    status: string;
    updateTime: string;
  };
  itemsPrice: number;
  shippingPrice: number;
  discountPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  orderStatus: 'PLACED' | 'CONFIRMED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURN_REQUESTED' | 'REFUNDED';
  awb?: string;
  courierPartner?: string;
  deliveredAt?: Date;
  estimatedDeliveryDate?: string;
  returnReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, default: 1 },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sellerName: { type: String, default: 'OneStall Direct' },
  commissionRate: { type: Number, default: 10 },
  category: { type: String },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'UPI', 'CARD', 'WALLET'],
    default: 'COD',
  },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    updateTime: { type: String },
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  discountPrice: {
    type: Number,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  orderStatus: {
    type: String,
    enum: ['PLACED', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'REFUNDED'],
    default: 'PLACED',
  },
  awb: {
    type: String,
  },
  courierPartner: {
    type: String,
    default: 'OneStall Express',
  },
  deliveredAt: {
    type: Date,
  },
  estimatedDeliveryDate: {
    type: String,
  },
  returnReason: {
    type: String,
  },
}, {
  timestamps: true,
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
