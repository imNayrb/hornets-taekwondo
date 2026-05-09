import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    ruolo: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token di autenticazione mancante' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      ruolo: string;
    };

    const user = await prisma.adminUser.findUnique({
      where: { id: payload.id, isActive: true },
      select: { id: true, email: true, ruolo: true, isActive: true },
    });

    if (!user) {
      res.status(401).json({ error: 'Utente non trovato o disabilitato' });
      return;
    }

    req.user = { id: user.id, email: user.email, ruolo: user.ruolo };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token scaduto', code: 'TOKEN_EXPIRED' });
    } else {
      res.status(401).json({ error: 'Token non valido' });
    }
  }
};

export const requireSuperAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.ruolo !== 'superadmin') {
    res.status(403).json({ error: 'Accesso riservato ai superadmin' });
    return;
  }
  next();
};
