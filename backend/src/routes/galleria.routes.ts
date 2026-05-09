import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { prisma } from '../utils/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { uploadMultiple } from '../middleware/upload.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import path from 'path';
import fs from 'fs/promises';

export const galleriaRouter = Router();

// GET /api/galleria - Galleria pubblica
galleriaRouter.get('/',
  [
    query('categoria').optional().trim(),
    query('tipo').optional().isIn(['foto', 'video']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);
      const skip = (page - 1) * limit;

      const where: Record<string, unknown> = { isVisible: true };
      if (req.query.categoria) where.categoria = req.query.categoria;
      if (req.query.tipo) where.tipo = req.query.tipo;

      const [items, total] = await Promise.all([
        prisma.galleria.findMany({
          where,
          orderBy: [{ ordine: 'asc' }, { createdAt: 'desc' }],
          take: limit,
          skip,
          select: {
            id: true, titolo: true, tipo: true, url: true,
            thumbnailUrl: true, altText: true, categoria: true, ordine: true,
          },
        }),
        prisma.galleria.count({ where }),
      ]);

      res.json({
        items,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/galleria/upload - Upload media (admin)
galleriaRouter.post('/upload',
  authenticate,
  uploadMultiple,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({ error: 'Nessun file caricato' });
        return;
      }

      const created = await Promise.all(
        files.map((file) =>
          prisma.galleria.create({
            data: {
              url: `/uploads/${file.filename}`,
              tipo: file.mimetype.startsWith('video/') ? 'video' : 'foto',
              dimensioneBytes: file.size,
              titolo: req.body.titolo || file.originalname,
              categoria: req.body.categoria || 'generale',
            },
          })
        )
      );

      res.status(201).json({ uploaded: created.length, items: created });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/galleria/:id - Admin
galleriaRouter.delete('/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await prisma.galleria.findUnique({ where: { id: req.params.id } });
      if (!item) {
        res.status(404).json({ error: 'Media non trovato' });
        return;
      }

      // Rimuovi file fisico
      if (item.url.startsWith('/uploads/')) {
        const filePath = path.join(process.env.UPLOAD_DIR || './uploads', path.basename(item.url));
        await fs.unlink(filePath).catch(() => {});
      }

      await prisma.galleria.delete({ where: { id: req.params.id } });
      res.json({ message: 'Media eliminato' });
    } catch (err) {
      next(err);
    }
  }
);
