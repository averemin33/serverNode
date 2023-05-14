import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import APIError from '../errors/APIError.js';

@Middleware({ type: 'after' })
export class MiddlewateError implements ExpressErrorMiddlewareInterface {
  error(err: any, req: any, res: any, next: any) {
    if (err instanceof APIError) {
      return res.send(err);
    }
    return res.send(err);
  }
}
