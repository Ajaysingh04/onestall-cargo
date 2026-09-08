import express from 'express';
import {
  calculateRates,
  createShipment,
  getShipmentByAwb,
  updateShipmentStage,
  submitPod,
  checkPincode,
  getAllShipments,
} from '../controllers/cargoController';

const router = express.Router();

router.get('/pincode/:pincode', checkPincode);
router.post('/rates', calculateRates);
router.post('/shipments', createShipment);
router.get('/shipments', getAllShipments);
router.get('/track/:awb', getShipmentByAwb);
router.put('/track/:awb/stage', updateShipmentStage);
router.post('/track/:awb/pod', submitPod);

export default router;
