import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

const ensureAuthenticated = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      error: 'Token is required.',
    });
  }

  // Separa o token da palabra Bearer do JWT
  const [, token] = authHeader.split(' ');

  try {
    const { sub } = verify(token, process.env.JWT_SECRET_KEY);

    request.user_id = String(sub);

    return next();
  } catch (err) {
    return response.status(401).json({ error: 'Token expired.' });
  }
};

export { ensureAuthenticated };
