import express from 'express';
import { getProducts, createProduct, deleteProduct, updateProduct } from '../controllers/productController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/:id')
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

export default router;
