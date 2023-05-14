import jwt from 'jsonwebtoken';
import config from 'config';

export function authMiddleware(req: any, res: any, next: any) {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw res.status(405).json({ message: 'Не авторизован' });
    }
    const decoded: any = jwt.verify(token, config.get('secretKey'));

    if (!decoded) {
      throw res.status(405).json({ message: 'Не авторизован' });
    }
    req.id = decoded.id;
    next();
  } catch (e) {
    throw res.json({ message: 'Не авторизован' });
  }
}
