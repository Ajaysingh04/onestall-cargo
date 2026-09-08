import mongoose from 'mongoose';

export interface IAuditStage {
  stage: string;
  statusText: string;
  location: string;
  timestamp: Date;
  responsiblePerson?: string;
  notes?: string;
  geoCoords?: {
    lat: number;
    lng: number;
  };
}

export interface IShipment extends mongoose.Document {
  awb: string;
  orderId?: mongoose.Types.ObjectId;
  orderNumber?: string;
  senderName: string;
  senderPhone: string;
  pickupAddress: string;
  pickupPincode: string;
  receiverName: string;
  receiverPhone: string;
  deliveryAddress: string;
  deliveryPincode: string;
  packageType: string;
  weight: number; // in kg
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  volumetricWeight: number;
  declaredValue: number;
  paymentMode: 'PREPAID' | 'COD';
  codAmount: number;
  courierPartner: 'OneStall Express' | 'Delhivery' | 'Bluedart' | 'Shadowfax';
  currentStatus: 
    | 'BOOKING_CONFIRMED'
    | 'PICKUP_SCHEDULED'
    | 'PICKED_UP'
    | 'INWARD_ORIGIN_HUB'
    | 'IN_TRANSIT'
    | 'DESTINATION_HUB'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'FAILED_ATTEMPT'
    | 'RTO_INITIATED'
    | 'RTO_DELIVERED';
  assignedFranchise?: string;
  assignedRiderName?: string;
  assignedRiderPhone?: string;
  deliveryOtp?: string;
  digitalSignature?: string;
  deliveryPhotoProof?: string;
  gpsLocation?: {
    lat: number;
    lng: number;
  };
  settlementStatus: 'PENDING' | 'RECONCILED' | 'SETTLED';
  timeline: IAuditStage[];
  createdAt: Date;
  updatedAt: Date;
}

const auditStageSchema = new mongoose.Schema({
  stage: { type: String, required: true },
  statusText: { type: String, required: true },
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  responsiblePerson: { type: String },
  notes: { type: String },
  geoCoords: {
    lat: { type: Number },
    lng: { type: Number },
  },
}, { _id: false });

const shipmentSchema = new mongoose.Schema({
  awb: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  orderNumber: {
    type: String,
  },
  senderName: {
    type: String,
    required: true,
  },
  senderPhone: {
    type: String,
    required: true,
  },
  pickupAddress: {
    type: String,
    required: true,
  },
  pickupPincode: {
    type: String,
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  receiverPhone: {
    type: String,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  deliveryPincode: {
    type: String,
    required: true,
  },
  packageType: {
    type: String,
    default: 'Standard Box',
  },
  weight: {
    type: Number,
    required: true,
    default: 0.5,
  },
  dimensions: {
    length: { type: Number, default: 15 },
    width: { type: Number, default: 10 },
    height: { type: Number, default: 5 },
  },
  volumetricWeight: {
    type: Number,
    default: 0.5,
  },
  declaredValue: {
    type: Number,
    default: 999,
  },
  paymentMode: {
    type: String,
    enum: ['PREPAID', 'COD'],
    default: 'PREPAID',
  },
  codAmount: {
    type: Number,
    default: 0,
  },
  courierPartner: {
    type: String,
    enum: ['OneStall Express', 'Delhivery', 'Bluedart', 'Shadowfax'],
    default: 'OneStall Express',
  },
  currentStatus: {
    type: String,
    default: 'BOOKING_CONFIRMED',
  },
  assignedFranchise: {
    type: String,
    default: 'Delhi Central Hub (DL-01)',
  },
  assignedRiderName: {
    type: String,
    default: 'Rahul Sharma',
  },
  assignedRiderPhone: {
    type: String,
    default: '+91 98112 34567',
  },
  deliveryOtp: {
    type: String,
    default: '4829',
  },
  digitalSignature: {
    type: String,
  },
  deliveryPhotoProof: {
    type: String,
  },
  gpsLocation: {
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.2090 },
  },
  settlementStatus: {
    type: String,
    enum: ['PENDING', 'RECONCILED', 'SETTLED'],
    default: 'PENDING',
  },
  timeline: [auditStageSchema],
}, {
  timestamps: true,
});

const Shipment = mongoose.model<IShipment>('Shipment', shipmentSchema);

export default Shipment;
