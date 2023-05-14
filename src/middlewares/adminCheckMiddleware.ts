import AppError from '../errors/APIError.js';

export const adminCheckMiddleware = (req: any, res: any, next: any) => {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    if (req.auth.role !== 'ADMIN') {
      throw new Error('Error, only for administrator');
    }
    next();
  } catch (e) {
    if (e instanceof Error) next(AppError.badRequest(e.message));
  }
  AppError;
};
