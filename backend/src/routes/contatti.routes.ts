import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';
import { prisma } from '../utils/prisma';
import { validateRequest } from '../middleware/validate.middleware';

export const contattiRouter = Router();

// POST /api/contatti - Form di contatto pubblico
contattiRouter.post('/',
  [
    body('nome').trim().notEmpty().isLength({ max: 200 }).withMessage('Nome obbligatorio'),
    body('email').isEmail().normalizeEmail().withMessage('Email non valida'),
    body('telefono').optional().isMobilePhone('it-IT'),
    body('messaggio').trim().notEmpty().isLength({ min: 10, max: 5000 }).withMessage('Messaggio obbligatorio (10-5000 caratteri)'),
    body('oggetto').optional().trim().isLength({ max: 500 }),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanificazione XSS
      const messaggio = DOMPurify.sanitize(req.body.messaggio, { ALLOWED_TAGS: [] });

      await prisma.messaggioContatto.create({
        data: {
          nome: req.body.nome,
          email: req.body.email,
          telefono: req.body.telefono,
          oggetto: req.body.oggetto,
          messaggio,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        },
      });

      res.status(201).json({ message: 'Messaggio inviato con successo. Ti risponderemo presto!' });
    } catch (err) {
      next(err);
    }
  }
);
