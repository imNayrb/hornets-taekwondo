import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import slugify from 'slugify';
import { prisma } from '../utils/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

export const newsRouter = Router();

// GET /api/news - News pubbliche
newsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string || '10', 10);
    const page = parseInt(req.query.page as string || '1', 10);

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        select: {
          id: true, titolo: true, slug: true, estratto: true,
          fotoCopertina: true, tags: true, publishedAt: true,
          autore: { select: { nome: true, cognome: true } },
        },
      }),
      prisma.news.count({ where: { isPublished: true } }),
    ]);

    res.json({ news, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// GET /api/news/:slug
newsRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const news = await prisma.news.findUnique({
      where: { slug: req.params.slug, isPublished: true },
      include: { autore: { select: { nome: true, cognome: true, avatarUrl: true } } },
    });

    if (!news) {
      res.status(404).json({ error: 'Articolo non trovato' });
      return;
    }
    res.json(news);
  } catch (err) {
    next(err);
  }
});

// POST /api/news - Admin
newsRouter.post('/',
  authenticate,
  [
    body('titolo').trim().notEmpty().isLength({ max: 500 }),
    body('contenuto').trim().notEmpty(),
    body('estratto').optional().trim().isLength({ max: 1000 }),
  ],
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const slug = slugify(req.body.titolo, { lower: true, strict: true, locale: 'it' });

      const news = await prisma.news.create({
        data: {
          ...req.body,
          slug,
          autoreId: req.user!.id,
          publishedAt: req.body.isPublished ? new Date() : null,
        },
      });
      res.status(201).json(news);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/news/:id - Admin
newsRouter.put('/:id',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data: Record<string, unknown> = { ...req.body };
      if (req.body.isPublished && !req.body.publishedAt) {
        data.publishedAt = new Date();
      }
      const news = await prisma.news.update({ where: { id: req.params.id }, data });
      res.json(news);
    } catch (err) {
      next(err);
    }
  }
);
