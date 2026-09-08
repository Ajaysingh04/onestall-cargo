import mongoose from 'mongoose';

export interface IFranchise extends mongoose.Document {
  centreName: string;
  centreCode: string;
  city: string;
  state: string;
  address: string;
  managerName: string;
  managerPhone: string;
  assignedPincodes: string[];
  activeRidersCount: number;
  todayBookings: number;
  todayDelivered: number;
  pendingDeliveries: number;
  codCollectedToday: number;
  totalRevenue: number;
  franchiseMarginPercent: number;
  pendingSettlementAmount: number;
  performanceScore: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'MAINTENANCE';
}

const franchiseSchema = new mongoose.Schema({
  centreName: {
    type: String,
    required: true,
  },
  centreCode: {
    type: String,
    required: true,
    unique: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  managerName: {
    type: String,
    required: true,
  },
  managerPhone: {
    type: String,
    required: true,
  },
  assignedPincodes: [{
    type: String,
  }],
  activeRidersCount: {
    type: Number,
    default: 5,
  },
  todayBookings: {
    type: Number,
    default: 0,
  },
  todayDelivered: {
    type: Number,
    default: 0,
  },
  pendingDeliveries: {
    type: Number,
    default: 0,
  },
  codCollectedToday: {
    type: Number,
    default: 0,
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  franchiseMarginPercent: {
    type: Number,
    default: 15, // 15% margin
  },
  pendingSettlementAmount: {
    type: Number,
    default: 0,
  },
  performanceScore: {
    type: Number,
    default: 96.5,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'SUSPENDED', 'MAINTENANCE'],
    default: 'ACTIVE',
  },
}, {
  timestamps: true,
});

const Franchise = mongoose.model<IFranchise>('Franchise', franchiseSchema);

export default Franchise;
