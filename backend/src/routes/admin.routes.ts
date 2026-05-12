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

// ─── CORSI ──────────────────────────────────────────────────────────────────

// GET /api/admin/corsi - Tutti i corsi (attivi + inattivi)
adminRouter.get('/corsi', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const corsi = await prisma.corso.findMany({
      orderBy: [{ ordine: 'asc' }, { nome: 'asc' }],
    });
    res.json(corsi);
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/corsi - Crea nuovo corso
adminRouter.post('/corsi', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const corso = await prisma.corso.create({ data: req.body });
    res.status(201).json(corso);
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/corsi/:id - Aggiorna corso
adminRouter.put('/corsi/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const corso = await prisma.corso.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(corso);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/corsi/:id/toggle - Attiva/disattiva corso
adminRouter.patch('/corsi/:id/toggle', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const current = await prisma.corso.findUniqueOrThrow({ where: { id: req.params.id } });
    const corso = await prisma.corso.update({
      where: { id: req.params.id },
      data: { isActive: !current.isActive },
    });
    res.json(corso);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/corsi/:id - Elimina definitivamente corso
adminRouter.delete('/corsi/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.corso.delete({ where: { id: req.params.id } });
    res.json({ message: 'Corso eliminato' });
  } catch (err) {
    next(err);
  }
});

// ─── NEWS ───────────────────────────────────────────────────────────────────

// GET /api/admin/news - Tutte le news (incluse non pubblicate)
adminRouter.get('/news', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string || '50', 10);
    const page = parseInt(req.query.page as string || '1', 10);

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        select: {
          id: true, titolo: true, slug: true, estratto: true,
          contenuto: true, tags: true,
          isPublished: true, publishedAt: true,
          createdAt: true, updatedAt: true,
          autore: { select: { nome: true, cognome: true } },
        },
      }),
      prisma.news.count(),
    ]);

    res.json({ news, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/news - Crea nuovo articolo
adminRouter.post('/news', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const slugify = require('slugify');
    const baseSlug = slugify(req.body.titolo, { lower: true, strict: true, locale: 'it' });
    // rendi lo slug unico aggiungendo timestamp se necessario
    const existing = await prisma.news.findUnique({ where: { slug: baseSlug } });
    const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

    const news = await prisma.news.create({
      data: {
        titolo: req.body.titolo,
        slug,
        contenuto: req.body.contenuto,
        estratto: req.body.estratto || null,
        tags: req.body.tags || [],
        isPublished: req.body.isPublished ?? false,
        publishedAt: req.body.isPublished ? new Date() : null,
        autoreId: req.user?.id || null,
      },
    });
    res.status(201).json(news);
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/news/:id - Modifica articolo
adminRouter.put('/news/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data: Record<string, unknown> = {
      titolo: req.body.titolo,
      contenuto: req.body.contenuto,
      estratto: req.body.estratto || null,
      tags: req.body.tags || [],
      isPublished: req.body.isPublished ?? false,
    };
    if (req.body.isPublished === true) data.publishedAt = new Date();
    if (req.body.isPublished === false) data.publishedAt = null;

    const news = await prisma.news.update({ where: { id: req.params.id }, data });
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/news/:id - Aggiorna campo (es. isPublished)
adminRouter.patch('/news/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data: Record<string, unknown> = { ...req.body };
    if (req.body.isPublished === true) {
      data.publishedAt = new Date();
    } else if (req.body.isPublished === false) {
      data.publishedAt = null;
    }
    const news = await prisma.news.update({ where: { id: req.params.id }, data });
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/news/:id
adminRouter.delete('/news/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.news.delete({ where: { id: req.params.id } });
    res.json({ message: 'News eliminata' });
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
