import { Request, Response } from 'express';
import Order from '../models/Order';
import Shipment, { IAuditStage } from '../models/Shipment';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      user,
      customerName,
      customerEmail,
      customerPhone,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      discountPrice,
      totalPrice,
      courierPartner = 'OneStall Express',
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items specified' });
    }

    // Generate unique AWB and Delivery OTP
    const awb = 'OS-' + Math.floor(100000000 + Math.random() * 900000000);
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Create Order
    const order = new Order({
      user,
      customerName,
      customerEmail,
      customerPhone,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      discountPrice,
      totalPrice,
      isPaid: paymentMethod !== 'COD',
      paidAt: paymentMethod !== 'COD' ? new Date() : undefined,
      orderStatus: 'CONFIRMED',
      awb,
      courierPartner,
      estimatedDeliveryDate: new Date(Date.now() + 24 * 3600 * 1000).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    });

    const createdOrder = await order.save();

    // Auto-create OneStall Cargo shipment with full audit trail!
    const initialStage: IAuditStage = {
      stage: 'BOOKING_CONFIRMED',
      statusText: `Marketplace Order #${createdOrder._id.toString().slice(-6).toUpperCase()} placed. Cargo manifest generated.`,
      location: `${shippingAddress.city || 'Central Hub'} (${shippingAddress.pincode})`,
      timestamp: new Date(),
      responsiblePerson: 'OneStall Automated Dispatcher',
      notes: 'Auto-routed to nearest fulfillment franchise.',
      geoCoords: { lat: 28.6139, lng: 77.2090 },
    };

    const newShipment = new Shipment({
      awb,
      orderId: createdOrder._id,
      orderNumber: 'ORD-' + createdOrder._id.toString().slice(-6).toUpperCase(),
      senderName: orderItems[0]?.sellerName || 'OneStall Central Warehouse',
      senderPhone: '+91 11 4982 9000',
      pickupAddress: 'Sector 62 Logistic Hub, OneStall Fulfillment Center',
      pickupPincode: '110001',
      receiverName: customerName,
      receiverPhone: customerPhone,
      deliveryAddress: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}`,
      deliveryPincode: shippingAddress.pincode,
      packageType: 'Marketplace Parcel',
      weight: 0.8,
      declaredValue: totalPrice,
      paymentMode: paymentMethod === 'COD' ? 'COD' : 'PREPAID',
      codAmount: paymentMethod === 'COD' ? totalPrice : 0,
      courierPartner,
      currentStatus: 'BOOKING_CONFIRMED',
      deliveryOtp,
      timeline: [initialStage],
    });

    await newShipment.save();

    res.status(201).json({
      order: createdOrder,
      shipment: newShipment,
      message: 'Order placed & OneStall Cargo shipment auto-created with AWB ' + awb,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { user: userId } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
