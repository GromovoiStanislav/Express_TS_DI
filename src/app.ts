import 'reflect-metadata';
import express, { Express } from 'express';
import { Server } from 'node:http';
import { json } from 'body-parser';
import { ILogger } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { UserController } from './users/users.controller';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IUserController) private userController: UserController,
		@inject(TYPES.IExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 3000;
	}

	useMiddleware(): void {
		this.app.use(json());//express.json()
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
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
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Example app listening on port http://localhost:${this.port}/`);
	}

	public close(): void {
		this.server.close();
	}
}
