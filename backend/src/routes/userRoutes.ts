import express from 'express';
import { authUser, registerUser, getUsers } from '../controllers/userController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);

router.route('/')
  .get(protect, admin, getUsers);

export default router;
