import express from 'express';
import { createOrder, getOrderById, getMyOrders, getAllOrders } from '../controllers/orderController';

const router = express.Router();

router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);

export default router;
