import 'reflect-metadata';
import { ExpressReturnType, IControllerRoute } from './route.interface';
import { Response, Router } from 'express';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public created(res: Response): ExpressReturnType {
		return res.sendStatus(201);
	}

	public send<T>(res: Response, code: number, message: T): ExpressReturnType {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 200, message);
	}

	protected bindRoutes(routers: IControllerRoute[]): void {
		for (const route of routers) {
			this.logger.log(`[${route.method}] ${route.path}`);
			this.router[route.method](route.path, route.func.bind(this));
		}
	}
}
