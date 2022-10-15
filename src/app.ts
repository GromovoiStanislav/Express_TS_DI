import express, { Express } from 'express';
import { Server } from 'node:http';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILogger } from './logger/logger.interface';
import { UserController } from './users/users.controler';
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
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter
  ) {
    this.app = express();
    this.port = 3000;
  }

  useRoutes() {
    this.app.use('/users', this.userController.router);
  }

  useExeptionfilters() {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
  }

  public async init() {
    this.useRoutes();
    this.useExeptionfilters();
    this.server = this.app.listen(this.port);
    this.logger.log(
      `Example app listening on port http://localhost:${this.port}/`
    );
  }
}
