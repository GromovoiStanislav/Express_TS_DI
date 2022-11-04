import express, { Express } from 'express';
import { Server } from 'node:http';
import { json } from 'body-parser';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILogger } from './logger/logger.interface';
import { UserController } from './users/users.controller';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IUserController) private userController: UserController,
		@inject(TYPES.IExeptionFilter) private exeptionFilter: ExeptionFilter,
	) {
		this.app = express();
		this.port = 3000;
	}

	useMiddleware(): void {
		this.app.use(json());//express.json()
	}


	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExeptionfilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionfilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Example app listening on port http://localhost:${this.port}/`);
	}
}
