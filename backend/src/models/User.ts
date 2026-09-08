import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'super_admin' | 'operations' | 'franchise' | 'warehouse' | 'seller' | 'rider' | 'customer';
  isAdmin: boolean;
  phone?: string;
  businessName?: string;
  gstin?: string;
  kycStatus?: 'pending' | 'verified' | 'rejected';
  assignedFranchiseId?: mongoose.Types.ObjectId;
  assignedPincodes?: string[];
  vehicleNumber?: string;
  walletBalance: number;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['super_admin', 'operations', 'franchise', 'warehouse', 'seller', 'rider', 'customer'],
    default: 'customer',
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  phone: {
    type: String,
    default: '+91 98765 43210',
  },
  businessName: {
    type: String,
  },
  gstin: {
    type: String,
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'verified',
  },
  assignedFranchiseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Franchise',
  },
  assignedPincodes: [{
    type: String,
  }],
  vehicleNumber: {
    type: String,
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
