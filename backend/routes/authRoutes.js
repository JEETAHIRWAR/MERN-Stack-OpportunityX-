import express from 'express';
const router = express.Router();
import { register, login, forgotPassword, resetPassword, googleLogin } from "../controllers/authController.js"


router.post('/register', register);
router.post('/login', login);
router.get('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
