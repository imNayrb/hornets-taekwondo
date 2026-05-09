import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../utils/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email e password obbligatorie' });
      return;
    }

    const user = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Timing-safe: esegui bcrypt anche se l'utente non esiste
    const dummyHash = '$2b$12$dummy.hash.to.prevent.timing.attacks.for.security';
    const passwordMatch = await bcrypt.compare(
      password,
      user?.passwordHash || dummyHash
    );

    if (!user || !passwordMatch || !user.isActive) {
      res.status(401).json({ error: 'Credenziali non valide' });
      return;
    }

    const tokenPayload = { id: user.id, email: user.email, ruolo: user.ruolo };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Salva hash del refresh token nel DB
    const refreshHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        refreshTokenHash: refreshHash,
        ultimoAccesso: new Date(),
      },
    });

    // Refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 giorni
      path: '/api/auth',
    });

    logger.info(`Login effettuato: ${user.email} da IP ${req.ip}`);

    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        cognome: user.cognome,
        ruolo: user.ruolo,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token mancante' });
      return;
    }

    const payload = verifyRefreshToken(refreshToken);

    const refreshHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const user = await prisma.adminUser.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.refreshTokenHash !== refreshHash || !user.isActive) {
      res.status(401).json({ error: 'Refresh token non valido' });
      return;
    }

    const tokenPayload = { id: user.id, email: user.email, ruolo: user.ruolo };
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    const newRefreshHash = crypto
      .createHash('sha256')
      .update(newRefreshToken)
      .digest('hex');

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { refreshTokenHash: newRefreshHash },
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth',
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user?.id) {
      await prisma.adminUser.update({
        where: { id: req.user.id },
        data: { refreshTokenHash: null },
      });
    }

    res.clearCookie('refreshToken', { path: '/api/auth' });
    res.json({ message: 'Logout effettuato con successo' });
  } catch (err) {
    next(err);
  }
};

export const me = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        nome: true,
        cognome: true,
        ruolo: true,
        avatarUrl: true,
        ultimoAccesso: true,
      },
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
};
