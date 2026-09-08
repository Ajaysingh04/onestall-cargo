import express from 'express';
import { getFranchises, getFranchiseByCode, updateFranchiseRates } from '../controllers/franchiseController';

const router = express.Router();

router.get('/', getFranchises);
router.get('/:code', getFranchiseByCode);
router.put('/:id/rates', updateFranchiseRates);

export default router;
