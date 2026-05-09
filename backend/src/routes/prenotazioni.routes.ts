import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { prisma } from '../utils/prisma';
import { validateRequest } from '../middleware/validate.middleware';

export const prenotazioniRouter = Router();

// POST /api/prenota - Richiesta prova gratuita
prenotazioniRouter.post('/',
  [
    body('nome').trim().notEmpty().isLength({ max: 100 }),
    body('cognome').trim().notEmpty().isLength({ max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('telefono').optional().isMobilePhone('it-IT'),
    body('eta').optional().isInt({ min: 3, max: 80 }),
    body('corsoId').optional().isUUID(),
    body('messaggio').optional().trim().isLength({ max: 1000 }),
    body('dataPreferita').optional().isISO8601(),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const prenotazione = await prisma.prenotazioneProva.create({
        data: {
          nome: req.body.nome,
          cognome: req.body.cognome,
          email: req.body.email,
          telefono: req.body.telefono,
          eta: req.body.eta,
          corsoId: req.body.corsoId,
          messaggio: req.body.messaggio,
          dataPreferita: req.body.dataPreferita ? new Date(req.body.dataPreferita) : null,
        },
      });

      res.status(201).json({
        message: 'Prenotazione ricevuta! Ti contatteremo entro 24 ore per confermare la tua prova gratuita.',
        id: prenotazione.id,
      });
    } catch (err) {
      next(err);
    }
  }
);
