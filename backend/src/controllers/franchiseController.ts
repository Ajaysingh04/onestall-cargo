import { Request, Response } from 'express';
import Franchise from '../models/Franchise';
import Shipment from '../models/Shipment';
import User from '../models/User';

export const getFranchises = async (req: Request, res: Response) => {
  try {
    const franchises = await Franchise.find();
    res.json(franchises);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFranchiseByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const franchise = await Franchise.findOne({ centreCode: code });
    if (!franchise) return res.status(404).json({ message: 'Franchise not found' });

    // Fetch related active shipments for this franchise's pincodes
    const shipments = await Shipment.find({
      deliveryPincode: { $in: franchise.assignedPincodes },
    }).sort({ createdAt: -1 }).limit(20);

    const riders = await User.find({
      role: 'rider',
      assignedPincodes: { $in: franchise.assignedPincodes },
    }).select('-password');

    res.json({ franchise, shipments, riders });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFranchiseRates = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { franchiseMarginPercent } = req.body;
    const updated = await Franchise.findByIdAndUpdate(
      id,
      { franchiseMarginPercent },
      { new: true }
    );
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
