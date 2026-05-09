import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string;
  ruolo: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    issuer: 'hornets-taekwondo',
    audience: 'hornets-admin',
  } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: 'hornets-taekwondo',
    audience: 'hornets-admin',
  } as jwt.SignOptions);
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!, {
    issuer: 'hornets-taekwondo',
    audience: 'hornets-admin',
  }) as TokenPayload;
};
