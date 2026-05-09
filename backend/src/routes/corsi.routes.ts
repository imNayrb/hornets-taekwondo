import { Router } from 'express';
import { body, param } from 'express-validator';
import { prisma } from '../utils/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { NextFunction, Request, Response } from 'express';

export const corsiRouter = Router();

// GET /api/corsi - Elenco pubblico corsi attivi
corsiRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const corsi = await prisma.corso.findMany({
      where: { isActive: true },
      include: {
        orari: {
          where: { isActive: true },
          include: { maestro: { select: { nome: true, cognome: true, titolo: true } } },
          orderBy: [{ giorno: 'asc' }, { oraInizio: 'asc' }],
        },
      },
      orderBy: { ordine: 'asc' },
    });
    res.json(corsi);
  } catch (err) {
    next(err);
  }
});

// GET /api/corsi/:id
corsiRouter.get('/:id', param('id').isUUID(), validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const corso = await prisma.corso.findUnique({
      where: { id: req.params.id, isActive: true },
      include: {
        orari: {
          where: { isActive: true },
          include: { maestro: true },
        },
      },
    });
    if (!corso) {
      res.status(404).json({ error: 'Corso non trovato' });
      return;
    }
    res.json(corso);
  } catch (err) {
    next(err);
  }
});

// POST /api/corsi - Admin only
corsiRouter.post('/',
  authenticate,
  [
    body('nome').trim().notEmpty().withMessage('Nome corso obbligatorio'),
    body('livello').isIn(['bambini', 'ragazzi', 'adulti', 'agonisti', 'master']),
    body('prezzoMensile').optional().isFloat({ min: 0 }),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const corso = await prisma.corso.create({ data: req.body });
      res.status(201).json(corso);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/corsi/:id - Admin only
corsiRouter.put('/:id',
  authenticate,
  param('id').isUUID(),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const corso = await prisma.corso.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json(corso);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/corsi/:id - Admin only
corsiRouter.delete('/:id',
  authenticate,
  param('id').isUUID(),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.corso.update({
        where: { id: req.params.id },
        data: { isActive: false },
      });
      res.json({ message: 'Corso disattivato' });
    } catch (err) {
      next(err);
    }
  }
);
