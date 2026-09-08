import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db';

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import uploadRoutes from './routes/uploadRoutes';
import cargoRoutes from './routes/cargoRoutes';
import orderRoutes from './routes/orderRoutes';
import franchiseRoutes from './routes/franchiseRoutes';
import sellerRoutes from './routes/sellerRoutes';

// Root API Health Check
app.get('/', (req, res) => {
  res.send('OneStall Multi-Vendor & Cargo Logistics API is running smoothly.');
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cargo', cargoRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/franchises', franchiseRoutes);
app.use('/api/sellers', sellerRoutes);

// Make uploads folder static
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`OneStall Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
