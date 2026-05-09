import { Router } from 'express';
import { body } from 'express-validator';
import { login, logout, refresh, me } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';

export const authRouter = Router();

authRouter.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email non valida'),
    body('password').isLength({ min: 8 }).withMessage('Password troppo corta'),
  ],
  validateRequest,
  login
);

authRouter.post('/refresh', refresh);
authRouter.post('/logout', authenticate, logout);
authRouter.get('/me', authenticate, me);
