import { HTTPError } from '../errors/http-error.class';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';
import { IUserController } from './users.controller.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private LoggerService: ILogger) {
		super(LoggerService);
		this.bindRoutes([
			{ path: '/login', method: 'post', func: this.login },
			{ path: '/register', method: 'post', func: this.register },
		]);
	}

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		console.log(req.body);
		next(new HTTPError(401, 'Ошибка авторизации', 'login'));
	}

	async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction):Promise<void> {
		
		const newUser = new User(body.email, body.name);
		await newUser.setPassword(body.password, 10);
	
		this.ok(res, newUser);
	}
}
