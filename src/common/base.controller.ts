import { IControllerRoute } from './route.interface';
import { LoggerService } from '../logger/logger.service';
import { Response, Router } from 'express';

export abstract class BaseController {
  private readonly _router: Router;

  constructor(private logger: LoggerService) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public created(res: Response) {
    return res.sendStatus(201);
  }

  public send<T>(res: Response, code: number, message: T) {
    res.type('application/json');
    return res.status(code).json(message);
  }

  public ok<T>(res: Response, message: T) {
    return this.send<T>(res, 200, message);
  }

  protected bindRoutes(routers: IControllerRoute[]) {
    for (const route of routers) {
      this.logger.log(`[${route.method}] ${route.path}`);
      this.router[route.method](route.path, route.func.bind(this));
    }
  }
}