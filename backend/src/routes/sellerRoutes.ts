import express from 'express';
import { getSellerDashboardStats, aiGenerateListing } from '../controllers/sellerController';

const router = express.Router();

router.get('/stats', getSellerDashboardStats);
router.post('/ai-generate', aiGenerateListing);

export default router;
