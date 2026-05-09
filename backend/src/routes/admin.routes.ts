import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const adminRouter = Router();

// Tutti gli endpoint admin richiedono autenticazione
adminRouter.use(authenticate);

// GET /api/admin/dashboard - Statistiche dashboard
adminRouter.get('/dashboard', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totaleIscritti,
      iscrittiAttivi,
      totaleCorsi,
      messaggiNuovi,
      prenotazioniNuove,
      ultimiMessaggi,
      ultimiIscritti,
    ] = await Promise.all([
      prisma.iscritto.count(),
      prisma.iscritto.count({ where: { stato: 'attiva' } }),
      prisma.corso.count({ where: { isActive: true } }),
      prisma.messaggioContatto.count({ where: { stato: 'nuovo' } }),
      prisma.prenotazioneProva.count({ where: { stato: 'nuova' } }),
      prisma.messaggioContatto.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, nome: true, email: true, oggetto: true, stato: true, createdAt: true },
      }),
      prisma.iscritto.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, nome: true, cognome: true, stato: true, corsoId: true, createdAt: true },
      }),
    ]);

    res.json({
      stats: { totaleIscritti, iscrittiAttivi, totaleCorsi, messaggiNuovi, prenotazioniNuove },
      ultimiMessaggi,
      ultimiIscritti,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/iscritti
adminRouter.get('/iscritti', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);
    const search = req.query.search as string;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { cognome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (req.query.stato) where.stato = req.query.stato;

    const [iscritti, total] = await Promise.all([
      prisma.iscritto.findMany({
        where,
        include: { corso: { select: { nome: true, livello: true } } },
        orderBy: { cognome: 'asc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.iscritto.count({ where }),
    ]);

    res.json({ iscritti, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/messaggi
adminRouter.get('/messaggi', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messaggi = await prisma.messaggioContatto.findMany({
      orderBy: { createdAt: 'desc' },
      take: parseInt(req.query.limit as string || '50', 10),
    });
    res.json(messaggi);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/messaggi/:id
adminRouter.patch('/messaggi/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const msg = await prisma.messaggioContatto.update({
      where: { id: req.params.id },
      data: { stato: req.body.stato, noteAdmin: req.body.noteAdmin },
    });
    res.json(msg);
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/prenotazioni
adminRouter.get('/prenotazioni', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const prenotazioni = await prisma.prenotazioneProva.findMany({
      orderBy: { createdAt: 'desc' },
      include: { corso: { select: { nome: true } } },
    });
    res.json(prenotazioni);
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/config - Configurazione sito
adminRouter.get('/config', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const configs = await prisma.sitoConfig.findMany();
    const configMap = Object.fromEntries(configs.map((c) => [c.chiave, c.valore]));
    res.json(configMap);
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/config - Aggiorna configurazione
adminRouter.put('/config', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const updates = Object.entries(req.body as Record<string, string>);

    await Promise.all(
      updates.map(([chiave, valore]) =>
        prisma.sitoConfig.update({
          where: { chiave },
          data: { valore, updatedBy: req.user!.id },
        })
      )
    );

    res.json({ message: 'Configurazione aggiornata', updated: updates.length });
  } catch (err) {
    next(err);
  }
});
