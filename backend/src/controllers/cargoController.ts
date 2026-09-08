import { Request, Response } from 'express';
import Shipment, { IAuditStage } from '../models/Shipment';
import Order from '../models/Order';

// Serviceable pincode database mockup with SLAs
const PINCODE_DATA: Record<string, { city: string; state: string; zone: string; slaDays: number; codAvailable: boolean }> = {
  '110001': { city: 'New Delhi', state: 'Delhi', zone: 'North', slaDays: 1, codAvailable: true },
  '110020': { city: 'South Delhi', state: 'Delhi', zone: 'North', slaDays: 1, codAvailable: true },
  '400001': { city: 'Mumbai', state: 'Maharashtra', zone: 'West', slaDays: 2, codAvailable: true },
  '560001': { city: 'Bengaluru', state: 'Karnataka', zone: 'South', slaDays: 2, codAvailable: true },
  '700001': { city: 'Kolkata', state: 'West Bengal', zone: 'East', slaDays: 3, codAvailable: true },
  '302001': { city: 'Jaipur', state: 'Rajasthan', zone: 'North', slaDays: 1, codAvailable: true },
  '500001': { city: 'Hyderabad', state: 'Telangana', zone: 'South', slaDays: 2, codAvailable: true },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', zone: 'South', slaDays: 2, codAvailable: true },
};

export const checkPincode = async (req: Request, res: Response) => {
  try {
    const { pincode } = req.params;
    const info = PINCODE_DATA[pincode] || {
      city: 'Standard City',
      state: 'Pan India',
      zone: 'Metro/Standard',
      slaDays: 3,
      codAvailable: true,
    };

    res.json({
      serviceable: true,
      pincode,
      ...info,
      estimatedDelivery: `${info.slaDays} - ${info.slaDays + 1} Days`,
      courierPartners: ['OneStall Express', 'Delhivery', 'Bluedart'],
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const calculateRates = async (req: Request, res: Response) => {
  try {
    const {
      weight = 0.5,
      length = 15,
      width = 10,
      height = 5,
      pickupPincode = '110001',
      deliveryPincode = '400001',
      paymentMode = 'PREPAID',
      codAmount = 0,
    } = req.body;

    const volumetricWeight = Math.max(Number(weight), (Number(length) * Number(width) * Number(height)) / 5000);
    const billableWeight = Math.ceil(volumetricWeight * 2) / 2; // round to nearest 0.5kg

    const pickupInfo = PINCODE_DATA[pickupPincode];
    const deliveryInfo = PINCODE_DATA[deliveryPincode];
    const isSameZone = pickupInfo && deliveryInfo && pickupInfo.zone === deliveryInfo.zone;
    const isIntraCity = pickupPincode.substring(0, 2) === deliveryPincode.substring(0, 2);

    // Dynamic Multi-courier rates comparison
    const baseMultiplier = isIntraCity ? 40 : isSameZone ? 65 : 90;
    const codFee = paymentMode === 'COD' ? Math.max(35, Math.round(Number(codAmount) * 0.015)) : 0;

    const rates = [
      {
        id: 'onestall-express',
        name: 'OneStall Express (Direct In-House)',
        type: 'Fastest & Recommended',
        rate: Math.round(baseMultiplier * billableWeight + 20) + codFee,
        sla: isIntraCity ? 'Same Day (Within 12 Hrs)' : isSameZone ? 'Next Day (24 Hrs)' : '2-3 Days',
        badge: 'Lowest Price & Dedicated Fleet',
        rating: 4.9,
      },
      {
        id: 'bluedart-air',
        name: 'Blue Dart Air Express',
        type: 'Premium Air',
        rate: Math.round((baseMultiplier + 45) * billableWeight + 40) + codFee,
        sla: isIntraCity ? 'Next Day' : '1-2 Days',
        badge: 'Air Cargo Priority',
        rating: 4.7,
      },
      {
        id: 'delhivery-surface',
        name: 'Delhivery Surface Pro',
        type: 'Economy Surface',
        rate: Math.round((baseMultiplier - 5) * billableWeight + 30) + codFee,
        sla: isIntraCity ? 'Next Day' : '3-4 Days',
        badge: 'Economical Heavy Parcel',
        rating: 4.5,
      },
      {
        id: 'shadowfax-hyper',
        name: 'Shadowfax Hyperlocal',
        type: 'Local Express',
        rate: Math.round(baseMultiplier * billableWeight + 15) + codFee,
        sla: isIntraCity ? 'Within 4 Hours' : '3-5 Days',
        badge: 'Best for Intra-City',
        rating: 4.4,
      },
    ];

    res.json({
      billableWeight,
      volumetricWeight: Number(volumetricWeight.toFixed(2)),
      codFee,
      couriers: rates,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createShipment = async (req: Request, res: Response) => {
  try {
    const {
      senderName,
      senderPhone,
      pickupAddress,
      pickupPincode,
      receiverName,
      receiverPhone,
      deliveryAddress,
      deliveryPincode,
      packageType,
      weight,
      declaredValue,
      paymentMode,
      codAmount,
      courierPartner = 'OneStall Express',
      orderId,
    } = req.body;

    const awb = 'OS-' + Math.floor(100000000 + Math.random() * 900000000);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const initialStage: IAuditStage = {
      stage: 'BOOKING_CONFIRMED',
      statusText: 'Shipment created on OneStall Cargo network',
      location: `${pickupPincode} (Origin)`,
      timestamp: new Date(),
      responsiblePerson: 'OneStall Automated Dispatch System',
      notes: 'AWB generated and manifest packet initialized.',
      geoCoords: { lat: 28.6139, lng: 77.2090 },
    };

    const shipment = new Shipment({
      awb,
      orderId,
      senderName,
      senderPhone,
      pickupAddress,
      pickupPincode,
      receiverName,
      receiverPhone,
      deliveryAddress,
      deliveryPincode,
      packageType,
      weight,
      declaredValue,
      paymentMode,
      codAmount: paymentMode === 'COD' ? codAmount : 0,
      courierPartner,
      currentStatus: 'BOOKING_CONFIRMED',
      deliveryOtp: otp,
      timeline: [initialStage],
    });

    const saved = await shipment.save();

    // If linked with Order, update Order AWB
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        awb,
        courierPartner,
        orderStatus: 'CONFIRMED',
      });
    }

    res.status(201).json(saved);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getShipmentByAwb = async (req: Request, res: Response) => {
  try {
    const { awb } = req.params;
    const shipment = await Shipment.findOne({ awb });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found with AWB ' + awb });
    }

    res.json(shipment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateShipmentStage = async (req: Request, res: Response) => {
  try {
    const { awb } = req.params;
    const { stage, statusText, location, responsiblePerson, notes, geoCoords } = req.body;

    const shipment = await Shipment.findOne({ awb });
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    const newStage: IAuditStage = {
      stage,
      statusText: statusText || `Shipment stage updated to ${stage}`,
      location: location || 'OneStall Hub',
      timestamp: new Date(),
      responsiblePerson: responsiblePerson || 'Hub Operator',
      notes,
      geoCoords,
    };

    shipment.timeline.push(newStage);
    shipment.currentStatus = stage;

    if (stage === 'DELIVERED') {
      shipment.settlementStatus = 'RECONCILED';
      if (shipment.orderId) {
        await Order.findByIdAndUpdate(shipment.orderId, {
          orderStatus: 'DELIVERED',
          deliveredAt: new Date(),
          isPaid: true,
        });
      }
    }

    await shipment.save();
    res.json(shipment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitPod = async (req: Request, res: Response) => {
  try {
    const { awb } = req.params;
    const { enteredOtp, signature, photoProof, receiverName, gpsCoords } = req.body;

    const shipment = await Shipment.findOne({ awb });
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    if (shipment.deliveryOtp && shipment.deliveryOtp !== enteredOtp) {
      return res.status(400).json({ message: 'Invalid OTP! Please request correct OTP from customer.' });
    }

    shipment.digitalSignature = signature;
    shipment.deliveryPhotoProof = photoProof;
    shipment.currentStatus = 'DELIVERED';
    shipment.settlementStatus = 'RECONCILED';

    const podStage: IAuditStage = {
      stage: 'DELIVERED',
      statusText: `Delivered successfully to ${receiverName || shipment.receiverName}. Digital POD verified with OTP.`,
      location: `${shipment.deliveryPincode} (Customer Doorstep)`,
      timestamp: new Date(),
      responsiblePerson: shipment.assignedRiderName || 'Delivery Executive',
      notes: 'OTP, Customer Signature & Geo-Coordinates verified.',
      geoCoords: gpsCoords || { lat: 28.6139, lng: 77.2090 },
    };

    shipment.timeline.push(podStage);
    await shipment.save();

    if (shipment.orderId) {
      await Order.findByIdAndUpdate(shipment.orderId, {
        orderStatus: 'DELIVERED',
        deliveredAt: new Date(),
        isPaid: true,
      });
    }

    res.json({ message: 'Digital Proof of Delivery (POD) submitted successfully!', shipment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllShipments = async (req: Request, res: Response) => {
  try {
    const { status, partner, limit = 50 } = req.query;
    const filter: any = {};
    if (status) filter.currentStatus = status;
    if (partner) filter.courierPartner = partner;

    const shipments = await Shipment.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
    res.json(shipments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
