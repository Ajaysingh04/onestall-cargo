import { Request, Response } from 'express';
import Product from '../models/Product';
import Order from '../models/Order';
import Shipment from '../models/Shipment';

export const getSellerDashboardStats = async (req: Request, res: Response) => {
  try {
    const { sellerId } = req.query;

    const products = await Product.find(sellerId ? { sellerId } : {});
    const orders = await Order.find();

    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.countInStock <= 5);

    let grossSales = 0;
    let pendingOrders = 0;
    let deliveredOrders = 0;

    orders.forEach(order => {
      grossSales += order.totalPrice;
      if (order.orderStatus === 'DELIVERED') deliveredOrders++;
      else if (order.orderStatus === 'PLACED' || order.orderStatus === 'CONFIRMED' || order.orderStatus === 'SHIPPED') pendingOrders++;
    });

    const platformCommission = Math.round(grossSales * 0.08); // 8% average
    const netEarnings = grossSales - platformCommission;

    res.json({
      totalProducts,
      lowStockCount: lowStockProducts.length,
      grossSales,
      platformCommission,
      netEarnings,
      pendingOrders,
      deliveredOrders,
      lowStockProducts,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const aiGenerateListing = async (req: Request, res: Response) => {
  try {
    const { keyword, category = 'Fashion' } = req.body;

    if (!keyword) {
      return res.status(400).json({ message: 'Keyword is required' });
    }

    // AI Listing generator algorithm simulating natural language expansion
    const generated = {
      title: `${keyword} - OneStall Premium Crafted Edition`,
      category,
      sku: 'OS-' + category.substring(0, 3).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000),
      hsn: category === 'Fashion' ? '6203' : category === 'Electronics' ? '8517' : '3304',
      gstRate: category === 'Fashion' ? 12 : 18,
      suggestedMrp: 1999,
      suggestedPrice: 899,
      discountPercent: 55,
      weight: category === 'Fashion' ? 0.45 : category === 'Electronics' ? 0.75 : 0.3,
      dimensions: { length: 25, width: 20, height: 6 },
      description: `Elevate your lifestyle with the all-new ${keyword}. Designed with precision engineering, breathable materials, and all-weather durability. Backed by OneStall 100% genuine product guarantee and lightning-fast OneStall Cargo 24-hour delivery.`,
      tags: [keyword.toLowerCase(), 'onestall-express', 'trending', category.toLowerCase(), 'bestseller'],
      seoTitle: `Buy ${keyword} Online at Best Price in India | OneStall`,
      seoDescription: `Get authentic ${keyword} with instant OneStall Cargo shipping, cash on delivery, and 7-day easy returns on OneStall.`,
    };

    res.json(generated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
